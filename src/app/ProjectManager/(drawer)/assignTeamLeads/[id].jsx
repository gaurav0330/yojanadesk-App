import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, TextInput } from 'react-native';
import React, { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { useMutation, useQuery, gql } from '@apollo/client';

const GET_ALL_LEADS = gql`
  query GetAllLeads {
    getAllLeads {
      id
      username
      email
      role
    }
  }
`;

const GET_PROJECT_TEAM_LEADS = gql`
  query GetProjectTeamLeads($projectId: ID!) {
    getProjectById(id: $projectId) {
      teamLeads {
        teamLeadId
        leadRole
      }
    }
  }
`;

const ASSIGN_TEAM_LEAD = gql`
  mutation AssignTeamLead($projectId: ID!, $teamLeads: [TeamLeadInput!]!) {
    assignTeamLead(projectId: $projectId, teamLeads: $teamLeads) {
      success
      message
    }
  }
`;

const AssignTeamLeads = () => {
  const { id } = useLocalSearchParams();
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [leadRoles, setLeadRoles] = useState({});
  const [error, setError] = useState('');

  const { loading: leadsLoading, data: leadsData, error: leadsError } = useQuery(GET_ALL_LEADS);
  const { data: projectData } = useQuery(GET_PROJECT_TEAM_LEADS, {
    variables: { projectId: id }
  });

  const [assignTeamLead, { loading: assigning }] = useMutation(ASSIGN_TEAM_LEAD, {
    onCompleted: (data) => {
      if (data.assignTeamLead.success) {
        router.back();
      } else {
        setError(data.assignTeamLead.message || 'Failed to assign team leads');
      }
    },
    onError: (error) => {
      setError(error.message || 'An error occurred while assigning team leads');
      console.error('Assignment error:', error);
    },
  });

  const toggleLeadSelection = (lead) => {
    setSelectedLeads(prev => {
      const isSelected = prev.find(l => l.teamLeadId === lead.id);
      if (isSelected) {
        // Remove lead and their role
        setLeadRoles(roles => {
          const { [lead.id]: _, ...rest } = roles;
          return rest;
        });
        return prev.filter(l => l.teamLeadId !== lead.id);
      } else {
        // Add lead with default role
        setLeadRoles(roles => ({
          ...roles,
          [lead.id]: ''
        }));
        return [...prev, { teamLeadId: lead.id, leadRole: '' }];
      }
    });
    setError(''); // Clear any existing errors
  };

  const updateLeadRole = (leadId, role) => {
    setLeadRoles(prev => ({
      ...prev,
      [leadId]: role
    }));
    setSelectedLeads(prev => 
      prev.map(lead => 
        lead.teamLeadId === leadId 
          ? { ...lead, leadRole: role }
          : lead
      )
    );
    setError(''); // Clear any existing errors
  };

  const handleAssign = async () => {
    try {
      if (selectedLeads.length === 0) {
        setError('Please select at least one team lead');
        return;
      }

      // Check if all selected leads have roles
      const hasEmptyRoles = selectedLeads.some(lead => !lead.leadRole);
      if (hasEmptyRoles) {
        setError('Please specify roles for all selected team leads');
        return;
      }

      await assignTeamLead({
        variables: {
          projectId: id,
          teamLeads: selectedLeads.map(lead => ({
            teamLeadId: lead.teamLeadId,
            leadRole: lead.leadRole.trim() // Ensure no whitespace
          }))
        },
      });
    } catch (err) {
      console.error('Error in handleAssign:', err);
      setError('Failed to assign team leads. Please try again.');
    }
  };

  if (leadsLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (leadsError) {
    return (
      <View className="flex-1 justify-center items-center bg-white p-4">
        <Text className="text-red-500 text-center">
          Error loading team leads. Please try again later.
        </Text>
        <TouchableOpacity 
          className="mt-4 bg-blue-600 px-6 py-2 rounded-lg"
          onPress={() => router.back()}
        >
          <Text className="text-white">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Get currently assigned team lead IDs
  const assignedLeadIds = projectData?.getProjectById?.teamLeads?.map(lead => lead.teamLeadId) || [];
  
  // Filter out already assigned leads
  const availableLeads = leadsData?.getAllLeads?.filter(lead => 
    lead.role === 'Team_Lead' && !assignedLeadIds.includes(lead.id)
  ) || [];

  return (
    <View className="flex-1 bg-white p-4">
      <View className="mb-6">
        <Text className="text-2xl font-bold text-gray-800 mb-2">Assign Team Leads</Text>
        <Text className="text-gray-600">Select team leads and specify their roles</Text>
      </View>

      {availableLeads.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-600 text-center text-lg">
            All available team leads have been assigned to this project.
          </Text>
          <TouchableOpacity 
            className="mt-4 bg-blue-600 px-6 py-2 rounded-lg"
            onPress={() => router.back()}
          >
            <Text className="text-white">Go Back</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView className="flex-1">
          <View className="space-y-3">
            {availableLeads.map((lead) => {
              const isSelected = selectedLeads.find(l => l.teamLeadId === lead.id);
              return (
                <View key={lead.id} className="border-2 rounded-lg overflow-hidden">
                  <TouchableOpacity
                    className={`p-4 ${
                      isSelected
                        ? 'bg-blue-50 border-blue-500'
                        : 'bg-white border-gray-200'
                    }`}
                    onPress={() => toggleLeadSelection(lead)}
                  >
                    <Text className="font-medium text-gray-800">{lead.username}</Text>
                    <Text className="text-gray-600 text-sm">{lead.email}</Text>
                  </TouchableOpacity>
                  
                  {isSelected && (
                    <View className="px-4 py-2 bg-gray-50">
                      <Text className="text-sm text-gray-600 mb-1">Specify Role:</Text>
                      <TextInput
                        className="border border-gray-300 rounded-md p-2 bg-white"
                        value={leadRoles[lead.id]}
                        onChangeText={(text) => updateLeadRole(lead.id, text)}
                        placeholder="Enter role (e.g. Technical Lead, UI Lead)"
                      />
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </ScrollView>
      )}

      {error ? (
        <Text className="text-red-500 text-center my-2">{error}</Text>
      ) : null}

      {availableLeads.length > 0 && (
        <View className="mt-4 space-y-3">
          <TouchableOpacity
            className={`py-3 rounded-lg ${assigning ? 'bg-blue-400' : 'bg-blue-600'}`}
            onPress={handleAssign}
            disabled={assigning}
          >
            {assigning ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-center font-semibold text-lg">
                Assign Selected Leads
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            className="py-3"
            onPress={() => router.back()}
            disabled={assigning}
          >
            <Text className="text-blue-600 text-center">Skip for now</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default AssignTeamLeads; 