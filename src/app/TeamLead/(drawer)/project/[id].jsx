import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { gql, useQuery } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GET_PROJECT = gql`
  query GetProject($projectId: ID!) {
    getProject(projectId: $projectId) {
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

const GET_TASKS_FOR_LEAD = gql`
  query GetTasksForLead($teamLeadId: ID!) {
    getTasksForLead(teamLeadId: $teamLeadId) {
      id
      title
      description
      status
      priority
      dueDate
      createdAt
    }
  }
`;

export default function ProjectDashboard({projectId}) {

  const [teamLeadId, setTeamLeadId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('tasks');

  

  useEffect(() => {
    const fetchLeadId = async () => {
      try {
        const storedLeadId = await AsyncStorage.getItem('id');
        if (storedLeadId) {
          setTeamLeadId(storedLeadId);
        }
      } catch (error) {
        console.error('Error fetching lead ID:', error);
      }
    };
    fetchLeadId();
  }, []);

  const { loading: projectLoading, error: projectError, data: projectData } = useQuery(GET_PROJECT, {
    variables: { projectId },
    skip: !projectId,
  });

  const { loading: tasksLoading, error: tasksError, data: tasksData, refetch } = useQuery(GET_TASKS_FOR_LEAD, {
    variables: { teamLeadId },
    skip: !teamLeadId,
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'COMPLETED':
        return 'bg-green-500';
      case 'IN_PROGRESS':
        return 'bg-blue-500';
      case 'PENDING':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const renderTaskCard = ({ item }) => (
    <TouchableOpacity className="bg-white p-4 rounded-xl shadow-md mb-4">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-lg font-semibold text-black flex-1">{item.title || 'Untitled Task'}</Text>
        <View className={`px-2 py-1 rounded-lg ${getStatusColor(item.status)}`}>
          <Text className="text-white text-xs font-medium">{item.status || 'UNKNOWN'}</Text>
        </View>
      </View>
      <Text className="text-gray-600 text-sm mb-3" numberOfLines={2}>
        {item.description || 'No description available'}
      </Text>
      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center">
          <MaterialIcons name="event" size={16} color="#666" />
          <Text className="ml-1 text-xs text-gray-500">
            Due: {item.dueDate ? new Date(item.dueDate).toLocaleDateString() : 'Not set'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (projectLoading || tasksLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (projectError || tasksError) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-red-500 text-lg text-center mb-4">Error loading data.</Text>
        <TouchableOpacity onPress={onRefresh} className="bg-blue-500 px-4 py-2 rounded-lg">
          <Text className="text-white font-medium">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const project = projectData?.getProject;
  const tasks = tasksData?.getTasksForLead || [];

  return (
    <View className="flex-1 bg-gray-100">
      <View className="p-4 bg-white border-b border-gray-200">
        <Text className="text-2xl font-bold text-black">{project?.title || 'Project Dashboard'}</Text>
        <Text className="text-gray-600 mt-1">{project?.description || 'No description available'}</Text>
      </View>

      <View className="flex-row bg-white border-b border-gray-200">
        <TouchableOpacity
          className={`flex-1 p-4 ${activeTab === 'tasks' ? 'border-b-2 border-blue-500' : ''}`}
          onPress={() => setActiveTab('tasks')}
        >
          <Text className={`text-center font-medium ${activeTab === 'tasks' ? 'text-blue-500' : 'text-gray-500'}`}>
            My Tasks
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 p-4 ${activeTab === 'submit' ? 'border-b-2 border-blue-500' : ''}`}
          onPress={() => setActiveTab('submit')}
        >
          <Text className={`text-center font-medium ${activeTab === 'submit' ? 'text-blue-500' : 'text-gray-500'}`}>
            Submit Task
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'tasks' ? (
        <FlatList
          data={tasks}
          renderItem={renderTaskCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <Text className="text-gray-500 text-center mt-4">No tasks available.</Text>
          }
        />
      ) : (
        <View className="p-4">
          <Text className="text-gray-500 text-center">Submit Task form will be implemented here</Text>
        </View>
      )}
    </View>
  );
}
