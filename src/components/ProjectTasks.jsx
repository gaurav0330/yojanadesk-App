import React from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';

const GET_TASKS_FOR_MEMBER = gql`
  query GetTasksForMember($memberId: ID!, $projectId: ID!) {
    getTasksForMember(memberId: $memberId, projectId: $projectId) {
      id
      title
      description
      project
      createdBy
      assignedTo
      status
      priority
      dueDate
    }
  }
`;

const getPriorityColor = (priority) => {
  switch (priority?.toLowerCase()) {
    case 'high':
      return 'bg-red-100 text-red-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'low':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'in progress':
      return 'bg-blue-100 text-blue-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function ProjectTasks({ memberId, projectId }) {
  

  const { loading, error, data } = useQuery(GET_TASKS_FOR_MEMBER, {
    variables: { memberId, projectId },
    skip: !memberId || !projectId,
    onError: (error) => {
      console.error('Task Query Error:', error);
    },
    
  });

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="mt-4 text-gray-600">Loading tasks...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center p-4 bg-gray-50">
        <View className="bg-white p-6 rounded-xl shadow-sm w-full max-w-sm">
          <Text className="text-lg text-center text-red-500 mb-2">
            Error loading tasks
          </Text>
          <Text className="text-sm text-center text-gray-600 mb-4">
            {error.message}
          </Text>
          <TouchableOpacity 
            className="bg-blue-500 px-6 py-3 rounded-lg"
            onPress={() => window.location.reload()}
          >
            <Text className="text-white font-medium text-center">Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const tasks = data?.getTasksForMember || [];
  

  const renderTask = ({ item }) => (
    <TouchableOpacity 
      className="bg-white p-4 mb-3 rounded-xl shadow-sm border border-gray-100"
      activeOpacity={0.7}
    >
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <Text className="text-lg font-semibold text-gray-800">{item.title}</Text>
          <Text className="text-sm text-gray-600 mt-1">{item.description}</Text>
        </View>
        <View className={`px-2 py-1 rounded-full ${getPriorityColor(item.priority)}`}>
          <Text className="text-xs font-medium">{item.priority}</Text>
        </View>
      </View>

      <View className="flex-row justify-between items-center mt-3">
        <View className={`px-2 py-1 rounded-full ${getStatusColor(item.status)}`}>
          <Text className="text-xs font-medium">{item.status}</Text>
        </View>
        <View className="flex-row items-center">
          <Text className="text-xs text-gray-500 mr-2">Due:</Text>
          <Text className="text-xs font-medium text-gray-700">
            {new Date(item.dueDate).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <View className="p-4 bg-white border-b border-gray-200">
        <View className="flex-row justify-between items-center">
          <Text className="text-xl font-bold text-gray-800">Project Tasks</Text>
          <View className="flex-row space-x-2">
            <View className="flex-row items-center">
              <View className="w-3 h-3 rounded-full bg-green-500 mr-1" />
              <Text className="text-xs text-gray-600">Completed</Text>
            </View>
            <View className="flex-row items-center">
              <View className="w-3 h-3 rounded-full bg-blue-500 mr-1" />
              <Text className="text-xs text-gray-600">In Progress</Text>
            </View>
            <View className="flex-row items-center">
              <View className="w-3 h-3 rounded-full bg-yellow-500 mr-1" />
              <Text className="text-xs text-gray-600">Pending</Text>
            </View>
          </View>
        </View>
      </View>

      {tasks.length > 0 ? (
        <FlatList
          data={tasks}
          renderItem={renderTask}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View className="flex-1 items-center justify-center p-4">
          <View className="bg-white p-6 rounded-xl shadow-sm w-full max-w-sm">
            <Text className="text-lg text-center text-gray-600 mb-2">
              No tasks assigned for this project
            </Text>
            <Text className="text-sm text-center text-gray-500">
              Tasks will appear here once they are assigned to you
            </Text>
          </View>
        </View>
      )}
    </View>
  );
} 