import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { useProject } from './_layout';

// Query to get user details
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

// Query to get team leads
const GET_TEAM_LEADS = gql`
  query GetLeadsByProjectId($projectId: ID!) {
    getLeadsByProjectId(projectId: $projectId) {
      success
      message
      teamLeads {
        user {
          id
          username
          email
        }
        leadRole
      }
    }
  }
`;

// Query to get teams for each lead
const GET_TEAMS = gql`
  query GetTeamsByProjectAndLead($projectId: ID!, $leadId: ID!) {
    getTeamsByProjectAndLead(projectId: $projectId, leadId: $leadId) {
      id
      teamName
      description
      members {
        teamMemberId
        memberRole
      }
    }
  }
`;

const UserInfo = ({ userId, role }) => {
  const { loading, data } = useQuery(GET_USER, {
    variables: { userId },
    skip: !userId,
  });

  if (loading) {
    return (
      <View className="bg-white p-3 rounded-lg mb-2">
        <ActivityIndicator size="small" color="#007AFF" />
      </View>
    );
  }

  const user = data?.getUser;

  if (!user) {
    return null;
  }

  return (
    <View className="bg-white p-3 rounded-lg mb-2">
      <View className="flex-row justify-between items-center">
        <View>
          <Text className="font-medium text-gray-800">{user.username}</Text>
          <Text className="text-sm text-gray-600">{user.email}</Text>
          <Text className="text-sm text-blue-600">{role}</Text>
        </View>
        <View className="bg-blue-50 px-2 py-1 rounded-full">
          <Text className="text-sm text-blue-800">{user.role}</Text>
        </View>
      </View>
    </View>
  );
};

const TeamLeadCard = ({ lead, projectId }) => {
  const { loading: teamsLoading, data: teamsData } = useQuery(GET_TEAMS, {
    variables: { projectId, leadId: lead.user.id },
    skip: !projectId || !lead.user.id,
  });

  const teams = teamsData?.getTeamsByProjectAndLead || [];

  if (teamsLoading) {
    return (
      <View className="bg-white p-4 rounded-lg mb-4 shadow-sm">
        <View className="flex-row justify-between items-center mb-3">
          <View>
            <Text className="text-lg font-semibold text-gray-800">{lead.user.username}</Text>
            <Text className="text-sm text-gray-600">{lead.leadRole}</Text>
          </View>
          <ActivityIndicator size="small" color="#007AFF" />
        </View>
      </View>
    );
  }

  return (
    <View className="bg-white p-4 rounded-lg mb-4 shadow-sm">
      <View className="mb-4">
        <Text className="text-lg font-semibold text-gray-800 mb-2">Team Lead</Text>
        <UserInfo userId={lead.user.id} role={lead.leadRole} />
      </View>

      <View>
        <Text className="text-lg font-semibold text-gray-800 mb-2">Teams</Text>
        {teams.map((team) => (
          <View key={team.id} className="bg-gray-50 p-3 rounded-lg mb-3">
            <Text className="font-medium text-gray-800 text-lg mb-2">{team.teamName}</Text>
            <Text className="text-sm text-gray-600 mb-3">{team.description}</Text>
            
            <Text className="font-medium text-gray-700 mb-2">Team Members</Text>
            {team.members.map((member) => (
              <UserInfo 
                key={member.teamMemberId} 
                userId={member.teamMemberId}
                role={member.memberRole} 
              />
            ))}
          </View>
        ))}

        {teams.length === 0 && (
          <View className="bg-gray-50 p-3 rounded-lg">
            <Text className="text-sm text-gray-600">No teams created yet</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const TeamScreen = () => {
  const { projectId } = useProject();

  const { loading: leadsLoading, data: leadsData } = useQuery(GET_TEAM_LEADS, {
    variables: { projectId },
    skip: !projectId,
  });

  if (leadsLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  const teamLeads = leadsData?.getLeadsByProjectId?.teamLeads || [];

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        <Text className="text-2xl font-bold text-gray-800 mb-4">Project Team</Text>
        
        {teamLeads.map((lead) => (
          <TeamLeadCard 
            key={lead.user.id} 
            lead={lead}
            projectId={projectId}
          />
        ))}

        {teamLeads.length === 0 && (
          <View className="items-center mt-10">
            <Text className="text-lg font-semibold text-gray-800 mb-2">No team leads assigned</Text>
            <Text className="text-sm text-gray-600">Assign team leads to get started</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default TeamScreen; 