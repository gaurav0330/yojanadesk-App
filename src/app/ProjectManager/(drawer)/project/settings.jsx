import { View, Text, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useMutation, useQuery, gql } from '@apollo/client';
import { useProject } from './_layout';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Queries
const GET_PROJECT_DETAILS = gql`
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

const GET_TASKS_STATS = gql`
  query GetTasksByManager($managerId: ID!, $projectId: ID!) {
    getTasksByManager(managerId: $managerId, projectId: $projectId) {
      id
      status
      priority
    }
  }
`;

// Mutations
const DELETE_PROJECT = gql`
  mutation DeleteProject($projectId: ID!) {
    deleteProject(projectId: $projectId)
  }
`;

const TeamLeadCard = ({ teamLeadId, leadRole }) => {
  const { data, loading, error } = useQuery(GET_USER, {
    variables: { userId: teamLeadId },
    onError: (error) => {
      console.error('User fetch error:', error);
    }
  });

  if (loading) {
    return (
      <View className="flex-row items-center justify-between py-2 border-b border-gray-100">
        <ActivityIndicator size="small" color="#3B82F6" />
      </View>
    );
  }

  if (error || !data?.getUser) {
    return (
      <View className="flex-row items-center justify-between py-2 border-b border-gray-100">
        <View>
          <Text className="font-medium text-gray-800">User not found</Text>
          <Text className="text-sm text-gray-600">{leadRole}</Text>
        </View>
      </View>
    );
  }

  const user = data.getUser;

  return (
    <View className="flex-row items-center justify-between py-2 border-b border-gray-100">
      <View>
        <Text className="font-medium text-gray-800">{user.username}</Text>
        <Text className="text-sm text-gray-600">{leadRole}</Text>
        <Text className="text-xs text-gray-500">{user.email}</Text>
      </View>
    </View>
  );
};

const SettingsScreen = () => {
  const { projectId } = useProject();
  const [managerId, setManagerId] = useState(null);

  useEffect(() => {
    const getManagerId = async () => {
      const id = await AsyncStorage.getItem('id');
      setManagerId(id);
    };
    getManagerId();
  }, []);

  // Fetch project details
  const { data: projectDetails, loading: projectLoading, error: projectError } = useQuery(GET_PROJECT_DETAILS, {
    variables: { id: projectId },
    onError: (error) => {
      console.error('Project fetch error:', error);
      Alert.alert('Error', 'Failed to load project details');
    }
  });

  // Fetch tasks statistics
  const { data: tasksData, error: tasksError } = useQuery(GET_TASKS_STATS, {
    variables: { managerId, projectId },
    skip: !managerId || !projectId,
    onError: (error) => {
      console.error('Tasks fetch error:', error);
    }
  });

  const [deleteProject, { loading: deleteLoading }] = useMutation(DELETE_PROJECT, {
    onCompleted: (data) => {
      if (data.deleteProject) {
        Alert.alert(
          'Success',
          'Project deleted successfully',
          [
            {
              text: 'OK',
              onPress: () => router.replace('/ProjectManager/welcome')
            }
          ]
        );
      }
    },
    onError: (error) => {
      Alert.alert('Error', error.message);
    }
  });

  const handleDeleteProject = () => {
    Alert.alert(
      'Delete Project',
      'Are you sure you want to delete this project? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteProject({
              variables: { projectId }
            });
          }
        }
      ]
    );
  };

  const calculateTaskStats = () => {
    if (!tasksData?.getTasksByManager) return { total: 0, completed: 0, pending: 0, high: 0 };
    
    const tasks = tasksData.getTasksByManager;
    return {
      total: tasks.length,
      completed: tasks.filter(t => t.status === 'COMPLETED').length,
      pending: tasks.filter(t => t.status === 'PENDING').length,
      high: tasks.filter(t => t.priority === 'HIGH').length
    };
  };

  const stats = calculateTaskStats();

  if (projectLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  if (projectError) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-red-600 text-center">Failed to load project details. Please try again.</Text>
      </View>
    );
  }

  const project = projectDetails?.getProjectById;

  if (!project) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-gray-600 text-center">Project not found</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        <Text className="text-2xl font-bold text-gray-800 mb-6">Project Settings</Text>

        {/* Project Information Card */}
        <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
          <View className="flex-row items-center mb-3">
            <MaterialIcons name="info" size={24} color="#3B82F6" />
            <Text className="text-lg font-semibold text-gray-800 ml-2">Project Information</Text>
          </View>
          
          <View className="space-y-3">
            <View>
              <Text className="text-sm text-gray-600 mb-1">Project Title</Text>
              <Text className="text-base text-gray-800">{project.title}</Text>
            </View>
            
            <View>
              <Text className="text-sm text-gray-600 mb-1">Description</Text>
              <Text className="text-base text-gray-800">{project.description || 'No description'}</Text>
            </View>
            
            <View>
              <Text className="text-sm text-gray-600 mb-1">Category</Text>
              <Text className="text-base text-gray-800">{project.category || 'No category'}</Text>
            </View>

            <View>
              <Text className="text-sm text-gray-600 mb-1">Status</Text>
              <Text className="text-base text-gray-800">{project.status}</Text>
            </View>

            <View>
              <Text className="text-sm text-gray-600 mb-1">Timeline</Text>
              <Text className="text-base text-gray-800">
                {new Date(project.startDate).toLocaleDateString()} - 
                {new Date(project.endDate).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </View>

        {/* Team Management Card */}
        <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
          <View className="flex-row items-center mb-3">
            <MaterialIcons name="people" size={24} color="#3B82F6" />
            <Text className="text-lg font-semibold text-gray-800 ml-2">Team Management</Text>
          </View>
          
          {project.teamLeads?.map((lead) => (
            <TeamLeadCard 
              key={lead.teamLeadId} 
              teamLeadId={lead.teamLeadId} 
              leadRole={lead.leadRole} 
            />
          ))}
        </View>

        {/* Task Statistics Card */}
        <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
          <View className="flex-row items-center mb-3">
            <MaterialIcons name="assessment" size={24} color="#3B82F6" />
            <Text className="text-lg font-semibold text-gray-800 ml-2">Task Statistics</Text>
          </View>
          
          <View className="flex-row flex-wrap justify-between">
            <View className="bg-blue-50 p-3 rounded-lg w-[48%] mb-3">
              <Text className="text-2xl font-bold text-blue-600">{stats.total}</Text>
              <Text className="text-sm text-gray-600">Total Tasks</Text>
            </View>
            <View className="bg-green-50 p-3 rounded-lg w-[48%] mb-3">
              <Text className="text-2xl font-bold text-green-600">{stats.completed}</Text>
              <Text className="text-sm text-gray-600">Completed</Text>
            </View>
            <View className="bg-yellow-50 p-3 rounded-lg w-[48%]">
              <Text className="text-2xl font-bold text-yellow-600">{stats.pending}</Text>
              <Text className="text-sm text-gray-600">Pending</Text>
            </View>
            <View className="bg-red-50 p-3 rounded-lg w-[48%]">
              <Text className="text-2xl font-bold text-red-600">{stats.high}</Text>
              <Text className="text-sm text-gray-600">High Priority</Text>
            </View>
          </View>
        </View>

        {/* Danger Zone */}
        <View className="bg-white rounded-lg p-4 shadow-sm">
          <View className="flex-row items-center mb-3">
            <MaterialIcons name="warning" size={24} color="#EF4444" />
            <Text className="text-lg font-semibold text-red-600 ml-2">Danger Zone</Text>
          </View>
          <Text className="text-sm text-gray-600 mb-4">
            Once you delete a project, there is no going back. Please be certain.
          </Text>
          <TouchableOpacity
            onPress={handleDeleteProject}
            disabled={deleteLoading}
            className="flex-row items-center justify-center bg-red-50 p-3 rounded-lg"
          >
            {deleteLoading ? (
              <ActivityIndicator color="#EF4444" />
            ) : (
              <>
                <MaterialIcons name="delete" size={24} color="#EF4444" />
                <Text className="text-red-600 ml-2 font-medium">Delete Project</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default SettingsScreen; 