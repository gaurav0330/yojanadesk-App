import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useProject } from './_layout';

const GET_TASKS_BY_MANAGER = gql`
  query GetTasksByManager($managerId: ID!, $projectId: ID) {
    getTasksByManager(managerId: $managerId, projectId: $projectId) {
      id
      title
      description
      project
      createdBy
      assignedTo
      status
      priority
      dueDate
      assignName
      remarks
    }
  }
`;

const TaskCard = ({ task }) => (
  <TouchableOpacity 
    className="bg-white p-4 rounded-lg mb-3 shadow-sm border border-gray-100"
    onPress={() => router.push(`/ProjectManager/(drawer)/project/task/${task.id}`)}
  >
    <View className="flex-row justify-between items-start mb-2">
      <Text className="text-lg font-semibold text-gray-800 flex-1">{task.title}</Text>
      <View className={`px-2 py-1 rounded-full ${
        task.status === 'Completed' ? 'bg-green-100' :
        task.status === 'In Progress' ? 'bg-blue-100' :
        'bg-yellow-100'
      }`}>
        <Text className={`text-sm ${
          task.status === 'Completed' ? 'text-green-800' :
          task.status === 'In Progress' ? 'text-blue-800' :
          'text-yellow-800'
        }`}>
          {task.status}
        </Text>
      </View>
    </View>
    <Text className="text-gray-600 mb-2" numberOfLines={2}>
      {task.description || 'No description'}
    </Text>
    <View className="flex-row justify-between items-center">
      <Text className="text-sm text-gray-500">Assigned to: {task.assignName || 'Unassigned'}</Text>
      <Text className="text-sm text-gray-500">
        Due: {new Date(task.dueDate).toLocaleDateString()}
      </Text>
    </View>
  </TouchableOpacity>
);

const TasksScreen = () => {
  const { projectId } = useProject();
  const [managerId, setManagerId] = useState(null);

  useEffect(() => {
    const getManagerId = async () => {
      const id = await AsyncStorage.getItem('id');
      setManagerId(id);
    };
    getManagerId();
  }, []);

  const { loading, error, data, refetch } = useQuery(GET_TASKS_BY_MANAGER, {
    variables: { managerId, projectId },
    skip: !managerId || !projectId,
  });

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-white p-4">
        <Text className="text-red-500 text-center mb-4">Error loading tasks: {error.message}</Text>
        <TouchableOpacity 
          onPress={() => router.reload()}
          className="bg-blue-500 px-6 py-2 rounded-lg"
        >
          <Text className="text-white">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const tasks = data?.getTasksByManager || [];

  return (
    <View className="flex-1 bg-gray-50">
      <View className="p-4 bg-white border-b border-gray-200">
        <TouchableOpacity 
          onPress={() => router.push({
            pathname: '/ProjectManager/(drawer)/createTask',
            params: { 
              projectId,
              onTaskCreated: () => {
                refetch();
              }
            }
          })}
          className="flex-row items-center bg-blue-500 px-4 py-2 rounded-lg self-start"
        >
          <MaterialIcons name="add" size={24} color="white" />
          <Text className="text-white font-medium ml-2">Create New Task</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        renderItem={({ item }) => <TaskCard task={item} />}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          <View className="items-center mt-10">
            <Text className="text-lg font-semibold text-gray-800 mb-2">No tasks found</Text>
            <Text className="text-sm text-gray-600">Create a new task to get started</Text>
          </View>
        }
      />
    </View>
  );
};

export default TasksScreen; 