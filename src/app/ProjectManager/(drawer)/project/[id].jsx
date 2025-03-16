import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { useQuery, gql, useApolloClient } from '@apollo/client';

const GET_USER = gql`
  query GetUser($userId: ID!) {
    getUser(userId: $userId) {
      id
      username
      email
      role
    }
  }
`;

const GET_PROJECT = gql`
  query GetProjectById($id: ID!) {
    getProjectById(id: $id) {
      id
      title
      description
      startDate
      endDate
      category
      status
      projectManager {
        id
        username
        email
        role
      }
      teamLeads {
        teamLeadId
        leadRole
      }
    }
  }
`;

// Separate component for Team Lead
const TeamLeadCard = ({ lead, userData, isLoading }) => {
  if (isLoading) {
    return (
      <View className="bg-white p-4 rounded-lg mb-3">
        <ActivityIndicator size="small" color="#007AFF" />
      </View>
    );
  }

  const user = userData;

  return (
    <View className="bg-white p-4 rounded-lg mb-3">
      <View className="flex-row justify-between items-center">
        <Text className="text-gray-800 font-medium">
          Lead Role:
        </Text>
        <Text className="text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
          {lead.leadRole.trim()}
        </Text>
      </View>
      {user && (
        <View className="mt-2">
          <Text className="text-gray-800">{user.username}</Text>
          <Text className="text-gray-600 text-sm">{user.email}</Text>
          <Text className="text-blue-600 text-sm">{user.role}</Text>
        </View>
      )}
    </View>
  );
};

const ProjectDetails = () => {
  const { id } = useLocalSearchParams();
  const [teamLeadUsers, setTeamLeadUsers] = useState({});
  const [loadingUsers, setLoadingUsers] = useState({});
  const client = useApolloClient();

  const { loading, error, data, refetch } = useQuery(GET_PROJECT, {
    variables: { id },
    fetchPolicy: 'network-only',
    onError: (error) => {
      console.error('GraphQL error:', {
        message: error.message,
        networkError: error.networkError?.message,
        graphQLErrors: error.graphQLErrors
      });
    },
    onCompleted: (data) => {
      console.log('Query completed:', {
        hasData: !!data,
        projectData: data?.getProjectById,
        projectId: id
      });
    }
  });

  // Fetch team lead user data
  useEffect(() => {
    const fetchTeamLeadUsers = async () => {
      if (data?.getProjectById?.teamLeads) {
        const teamLeads = data.getProjectById.teamLeads;
        
        for (const lead of teamLeads) {
          setLoadingUsers(prev => ({ ...prev, [lead.teamLeadId]: true }));
          try {
            const response = await client.query({
              query: GET_USER,
              variables: { userId: lead.teamLeadId },
            });
            setTeamLeadUsers(prev => ({
              ...prev,
              [lead.teamLeadId]: response.data.getUser
            }));
          } catch (error) {
            console.error(`Error fetching user data for team lead ${lead.teamLeadId}:`, error);
          } finally {
            setLoadingUsers(prev => ({ ...prev, [lead.teamLeadId]: false }));
          }
        }
      }
    };

    fetchTeamLeadUsers();
  }, [data?.getProjectById?.teamLeads]);

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Not set';
    try {
      // Convert milliseconds to Date object
      const date = new Date(parseInt(timestamp));
      // Check if date is valid
      if (isNaN(date.getTime())) return 'Invalid date';
      // Format date
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (err) {
      console.error('Date formatting error:', err);
      return 'Invalid date';
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#007AFF" />
        <Text className="mt-2 text-gray-600">Loading project details...</Text>
      </View>
    );
  }

  if (!data?.getProjectById) {
    console.error('Project not found:', {
      id,
      hasData: !!data,
      dataKeys: data ? Object.keys(data) : []
    });
    return (
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-red-500 text-center mb-4">
          Project not found. Please check if the project ID is correct.
        </Text>
        <TouchableOpacity 
          onPress={async () => {
            console.log('Retrying fetch for project:', id);
            try {
              await refetch();
            } catch (err) {
              console.error('Refetch failed:', err);
            }
          }}
          className="bg-blue-500 px-6 py-2 rounded-lg mb-4"
        >
          <Text className="text-white">Retry</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => {
            console.log('Navigating back from project:', id);
            router.back();
          }}
          className="px-6 py-2"
        >
          <Text className="text-blue-600">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const project = data.getProjectById;
  const projectManager = project.projectManager || {};
  const teamLeads = project.teamLeads || [];

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Project Header */}
      <View className="bg-blue-600 p-6">
        <Text className="text-2xl font-bold text-white mb-2">{project.title}</Text>
        <View className="flex-row justify-between items-center mt-2">
          <Text className="text-white opacity-90 bg-blue-700 px-3 py-1 rounded-full">
            {project.status}
          </Text>
          <Text className="text-white opacity-90 bg-blue-700 px-3 py-1 rounded-full">
            {project.category}
          </Text>
        </View>
      </View>

      {/* Project Details */}
      <View className="p-6">
        {/* Description */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-800 mb-2">Description</Text>
          <Text className="text-gray-600 bg-white p-4 rounded-lg">
            {project.description || 'No description available'}
          </Text>
        </View>

        {/* Timeline */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-800 mb-2">Timeline</Text>
          <View className="bg-white p-4 rounded-lg">
            <View className="flex-row justify-between mb-4 items-center">
              <Text className="text-gray-600">Start Date:</Text>
              <Text className="text-gray-800 bg-blue-50 px-3 py-1 rounded-full">
                {formatDate(project.startDate)}
              </Text>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-600">End Date:</Text>
              <Text className="text-gray-800 bg-blue-50 px-3 py-1 rounded-full">
                {formatDate(project.endDate)}
              </Text>
            </View>
          </View>
        </View>

        {/* Project Manager */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-800 mb-2">Project Manager</Text>
          <View className="bg-white p-4 rounded-lg">
            <Text className="text-gray-800 font-medium text-lg">
              {projectManager.username}
            </Text>
            <Text className="text-gray-600 mt-1">{projectManager.email}</Text>
            <Text className="text-blue-600 mt-1 bg-blue-50 px-3 py-1 rounded-full self-start">
              {projectManager.role?.replace('_', ' ')}
            </Text>
          </View>
        </View>

        {/* Team Leads */}
        <View>
          <Text className="text-lg font-semibold text-gray-800 mb-2">Team Leads</Text>
          {teamLeads.length > 0 ? (
            teamLeads.map((lead, index) => (
              <TeamLeadCard
                key={`${lead.teamLeadId}-${index}`}
                lead={lead}
                userData={teamLeadUsers[lead.teamLeadId]}
                isLoading={loadingUsers[lead.teamLeadId]}
              />
            ))
          ) : (
            <View className="bg-white p-4 rounded-lg">
              <Text className="text-gray-600 italic">No team leads assigned yet</Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default ProjectDetails;
