import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, Animated } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { router } from 'expo-router';
import { useQuery, gql } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GET_MANAGER_PROJECTS = gql`
  query GetManagerProjects($managerId: ID!) {
    getProjectsByManagerId(managerId: $managerId) {
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

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const ProjectCard = ({ project }) => (
  <TouchableOpacity 
    className="bg-white rounded-xl p-4 mb-4 shadow-md border border-gray-100"
    onPress={() => router.push(`/ProjectManager/(drawer)/project/${project.id}`)}
  >
    <Text className="text-lg font-semibold text-gray-800 mb-2">{project.title}</Text>
    <Text className="text-sm text-gray-600 mb-3" numberOfLines={2}>
      {project.description || 'No description'}
    </Text>
    <View className="flex-row justify-between items-center">
      <Text className="text-sm text-blue-600 font-medium">Status: {project.status}</Text>
      <Text className="text-xs text-gray-500">
        {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
      </Text>
    </View>
  </TouchableOpacity>
);

const WelcomeScreen = () => {
  const [managerId, setManagerId] = React.useState(null);
  const scrollY = useRef(new Animated.Value(0)).current;

  const opacity = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    const getManagerId = async () => {
      const id = await AsyncStorage.getItem('id');
      setManagerId(id);
    };
    getManagerId();
  }, []);

  const { loading, error, data, refetch } = useQuery(GET_MANAGER_PROJECTS, {
    variables: { managerId },
    skip: !managerId,
  });

  const handleNewProject = () => {
    router.push('/ProjectManager/(drawer)/');
  };

  if (!managerId) return (
    <View className="flex-1 justify-center items-center">
      <ActivityIndicator size="large" color="#007AFF" />
    </View>
  );

  return (
    <View className="flex-1 bg-white">
      <View className="p-5">
        <Text className="text-2xl font-bold text-gray-800 mb-5">Welcome to Project Manager</Text>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : error ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-red-500 text-base mb-2">Error loading projects</Text>
          <TouchableOpacity onPress={() => refetch()}>
            <Text className="text-blue-600 text-sm">Tap to retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <AnimatedFlatList
          data={data?.getProjectsByManagerId || []}
          renderItem={({ item }) => <ProjectCard project={item} />}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 80 }}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
          ListEmptyComponent={
            <View className="items-center mt-10">
              <Text className="text-lg font-semibold text-gray-800 mb-2">No projects found</Text>
              <Text className="text-sm text-gray-600">Create your first project to get started</Text>
            </View>
          }
        />
      )}

      {/* Floating Button with Hide Animation */}
      <Animated.View
        style={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          opacity: opacity,
        }}
      >
        <TouchableOpacity 
          className="bg-blue-600 px-6 py-3 rounded-full shadow-lg"
          onPress={handleNewProject}
        >
          <Text className="text-white font-semibold">+ New Project</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default WelcomeScreen;
