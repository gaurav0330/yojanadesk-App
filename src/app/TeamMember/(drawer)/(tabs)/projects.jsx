import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProjectCard from '../../../../components/ProjectCard';
import { router } from 'expo-router';

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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const id = await AsyncStorage.getItem('id');
        const username = await AsyncStorage.getItem('username');
        const role = await AsyncStorage.getItem('userRole');
        
        console.log('Debug Info:', {
          id: id || 'Not found',
          username: username || 'Not found',
          role: role || 'Not found'
        });

        if (!id) {
          console.warn('No user ID found');
          setIsLoading(false);
          return; // Don't set userData if no ID
        }

        if (role !== 'Team_Member') {
          console.warn('User is not a Team Member');
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
      console.error('GraphQL Error:', error);
    },
  });

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="mt-4 text-gray-600">Loading user data...</Text>
      </View>
    );
  }

  if (!userData?.id) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50 p-4">
        <Text className="text-lg text-center text-red-500 mb-4">
          Unable to load your profile. Please log in again.
        </Text>
        <TouchableOpacity
          className="bg-blue-500 px-6 py-3 rounded-lg"
          onPress={() => router.replace('/login')}
        >
          <Text className="text-white font-medium">Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="mt-4 text-gray-600">Loading projects...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50 p-4">
        <Text className="text-lg text-center text-red-500 mb-4">
          Error loading projects: {error.message}
        </Text>
        <TouchableOpacity
          className="bg-blue-500 px-6 py-3 rounded-lg"
          onPress={() => router.reload()}
        >
          <Text className="text-white font-medium">Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const projects = data?.getProjectsByMember || [];

  const renderProject = ({ item }) => <ProjectCard project={item} />;

  return (
    <View className="flex-1 bg-gray-50">
      <View className="p-4 bg-white border-b border-gray-200">
        <Text className="text-xl font-bold text-gray-800">My Projects</Text>
        <Text className="text-sm text-gray-600">Welcome, {userData.username}</Text>
      </View>

      {projects.length > 0 ? (
        <FlatList
          data={projects}
          renderItem={renderProject}
          keyExtractor={(item) => item.id}
          contentContainerClassName="py-4"
        />
      ) : (
        <View className="flex-1 items-center justify-center p-4">
          <Text className="text-lg text-center text-gray-500 mb-4">
            You don't have any projects assigned yet.
          </Text>
        </View>
      )}
    </View>
  );
} 