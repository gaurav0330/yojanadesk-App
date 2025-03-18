import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProjectCard from '../../../../components/ProjectCard';
import ProjectTasks from '../../../../components/ProjectTasks';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const GET_PROJECTS_BY_MEMBER = gql`
  query GetProjectsByMember($memberId: ID!) {
    getProjectsByMember(memberId: $memberId) {
      id
      title
      description
      startDate
      endDate
      category
      status
    }
  }
`;

export default function Projects() {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const id = await AsyncStorage.getItem('id');
        const username = await AsyncStorage.getItem('username');
        const role = await AsyncStorage.getItem('userRole');

        if (!id || role !== 'Team_Member') {
          console.warn('Invalid user or role');
          setIsLoading(false);
          return;
        }

        setUserData({ id, username: username || 'User', role });
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const { loading, error, data } = useQuery(GET_PROJECTS_BY_MEMBER, {
    variables: { memberId: userData?.id },
    skip: !userData?.id,
    fetchPolicy: 'network-only',
    onError: (error) => {
      console.error('Project Query Error:', error);
    },
    
  });

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
  };

  const handleBackToProjects = () => {
    setSelectedProject(null);
  };

  if (isLoading) {
    return (
      <View className="items-center justify-center flex-1 bg-gray-50">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="mt-4 text-gray-600">Loading user data...</Text>
      </View>
    );
  }

  if (!userData?.id) {
    return (
      <View className="items-center justify-center flex-1 p-4 bg-gray-50">
        <Text className="mb-4 text-lg text-center text-red-500">
          Unable to load your profile. Please log in again.
        </Text>
        <TouchableOpacity
          className="px-6 py-3 bg-blue-500 rounded-lg"
          onPress={() => router.replace('/login')}
        >
          <Text className="font-medium text-white">Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loading) {
    return (
      <View className="items-center justify-center flex-1 bg-gray-50">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="mt-4 text-gray-600">Loading projects...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="items-center justify-center flex-1 p-4 bg-gray-50">
        <Text className="mb-4 text-lg text-center text-red-500">
          Error loading projects: {error.message}
        </Text>
        <TouchableOpacity
          className="px-6 py-3 bg-blue-500 rounded-lg"
          onPress={() => router.reload()}
        >
          <Text className="font-medium text-white">Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const projects = data?.getProjectsByMember || [];

  return (
    <View className="flex-1 bg-gray-50">
      {selectedProject ? (
        <View className="flex-1">
          <View className="flex-row items-center p-4 bg-white border-b border-gray-200">
            <TouchableOpacity onPress={handleBackToProjects} className="flex-row items-center mr-4">
              <Ionicons name="arrow-back" size={24} color="#3B82F6" />
              <Text className="ml-1 text-lg text-blue-500">Back to Projects</Text>
            </TouchableOpacity>
            <Text className="flex-1 text-xl font-bold text-gray-800">{selectedProject.title}</Text>
          </View>
          <ProjectTasks memberId={userData.id} projectId={selectedProject.id} />
        </View>
      ) : (
        <View className="flex-1">
          <View className="p-4 bg-white border-b border-gray-200">
            <Text className="text-xl font-bold text-gray-800">My Projects</Text>
            <Text className="text-sm text-gray-600">Welcome, {userData.username}</Text>
          </View>

          {projects.length > 0 ? (
            <FlatList
              data={projects}
              renderItem={({ item }) => (
                <ProjectCard 
                  project={item} 
                  onSelect={handleProjectSelect}
                />
              )}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingVertical: 16 }}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View className="items-center justify-center flex-1 p-4">
              <View className="w-full max-w-sm p-6 bg-white shadow-sm rounded-xl">
                <Text className="mb-2 text-lg text-center text-gray-600">
                  No projects assigned yet
                </Text>
                <Text className="text-sm text-center text-gray-500">
                  Projects will appear here once they are assigned to you
                </Text>
              </View>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

