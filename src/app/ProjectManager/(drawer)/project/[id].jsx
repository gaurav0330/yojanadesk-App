import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { useQuery, gql } from '@apollo/client';

const GET_PROJECT = gql`
  query GetProject($id: ID!) {
    getProjectById(id: $id) {
      id
      title
      description
      startDate
      endDate
      category
      status
      projectManager {
        username
        email
      }
      teamLeads {
        user {
          username
          email
        }
        leadRole
      }
    }
  }
`;

const ProjectDetails = () => {
  const { id } = useLocalSearchParams();
  
  const { loading, error, data } = useQuery(GET_PROJECT, {
    variables: { id },
  });

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-red-500 text-center">Error loading project details</Text>
      </View>
    );
  }

  const project = data?.getProjectById;

  return (
    <ScrollView className="flex-1 bg-white">
      {/* Project Header */}
      <View className="bg-blue-600 p-6">
        <Text className="text-2xl font-bold text-white mb-2">{project?.title}</Text>
        <Text className="text-white opacity-80">Status: {project?.status}</Text>
      </View>

      {/* Project Details */}
      <View className="p-6">
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-800 mb-2">Description</Text>
          <Text className="text-gray-600">{project?.description || 'No description available'}</Text>
        </View>

        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-800 mb-2">Timeline</Text>
          <View className="bg-gray-50 p-4 rounded-lg">
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Start Date:</Text>
              <Text className="text-gray-800">{new Date(project?.startDate).toLocaleDateString()}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-600">End Date:</Text>
              <Text className="text-gray-800">{new Date(project?.endDate).toLocaleDateString()}</Text>
            </View>
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-800 mb-2">Project Manager</Text>
          <View className="bg-gray-50 p-4 rounded-lg">
            <Text className="text-gray-800">{project?.projectManager?.username}</Text>
            <Text className="text-gray-600">{project?.projectManager?.email}</Text>
          </View>
        </View>

        <View>
          <Text className="text-lg font-semibold text-gray-800 mb-2">Team Leads</Text>
          {project?.teamLeads?.length > 0 ? (
            project.teamLeads.map((lead, index) => (
              <View key={index} className="bg-gray-50 p-4 rounded-lg mb-2">
                <Text className="text-gray-800 font-medium">{lead.user.username}</Text>
                <Text className="text-gray-600">{lead.user.email}</Text>
                <Text className="text-blue-600 mt-1">Role: {lead.leadRole}</Text>
              </View>
            ))
          ) : (
            <Text className="text-gray-600">No team leads assigned</Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default ProjectDetails; 