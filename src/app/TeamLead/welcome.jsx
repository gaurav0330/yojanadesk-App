import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { gql, useQuery } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ✅ Fixed: Use variable for the query instead of hardcoding leadId
const GET_PROJECTS_BY_LEAD = gql`
  query GetProjectsByLeadId($leadId: ID!) {
    getProjectsByLeadId(leadId: $leadId) {
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

export default function Welcome() {
  const router = useRouter();
  const [teamLeadId, setTeamLeadId] = React.useState(null);
  const [refreshing, setRefreshing] = React.useState(false);

  React.useEffect(() => {
    const fetchLeadId = async () => {
      try {
        const storedLeadId = await AsyncStorage.getItem("id");
        if (storedLeadId) {
          setTeamLeadId(storedLeadId);
        } else {
          router.replace('/login'); // Redirect if no ID found
        }
      } catch (error) {
        console.error("Error fetching lead ID:", error);
        router.replace('/login');
      }
    };
    fetchLeadId();
  }, []);

  // ✅ Fixed: Query now correctly uses teamLeadId as a variable
  const { loading, error, data, refetch } = useQuery(GET_PROJECTS_BY_LEAD, {
    variables: { leadId: teamLeadId },
    skip: !teamLeadId,
    onError: (error) => console.error("GraphQL Error:", error),
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleProjectPress = (project) => {
    // Store project ID for reference
    AsyncStorage.setItem("currentProjectId", project.id);
    // ✅ Fixed: Corrected pathname formatting
    router.push({
      pathname: `/TeamLead/(drawer)/project/${project.id}`,
      params: { 
        projectId: project.id, // Passing project ID as both param and prop
        projectData: JSON.stringify(project),
      }
    });
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      router.replace('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#007AFF" />
        <Text className="mt-2 text-gray-600">Loading projects...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-red-500 text-lg text-center mb-4">
          Error loading projects: {error.message}
        </Text>
        <TouchableOpacity
          onPress={() => refetch()}
          className="bg-blue-500 px-4 py-2 rounded-lg"
        >
          <Text className="text-white font-medium">Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ✅ Fixed: Correctly access project list from GraphQL response
  if (!data || !data.getProjectsByLeadId || data.getProjectsByLeadId.length === 0) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-gray-500 text-lg text-center mb-4">
          No projects found
        </Text>
        <TouchableOpacity
          onPress={() => refetch()}
          className="bg-blue-500 px-4 py-2 rounded-lg"
        >
          <Text className="text-white font-medium">Refresh</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderProjectCard = ({ item }) => (
    <TouchableOpacity
      className="bg-white p-4 rounded-xl shadow-md mb-4"
      onPress={() => handleProjectPress(item)}
    >
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-lg font-semibold text-black flex-1">
          {item.title || "Untitled Project"}
        </Text>
        <View
          className={`px-3 py-1 rounded-lg ${
            item.status === 'ACTIVE' ? 'bg-green-500' : 'bg-yellow-400'
          }`}
        >
          <Text className="text-white font-medium">{item.status || 'UNKNOWN'}</Text>
        </View>
      </View>
      <Text className="text-gray-600 text-sm mb-3" numberOfLines={2}>
        {item.description || "No description available"}
      </Text>
      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center">
          <MaterialIcons name="event" size={16} color="#666" />
          <Text className="ml-1 text-xs text-gray-500">
            {item.startDate ? new Date(item.startDate).toLocaleDateString() : "No start date"}
          </Text>
        </View>
        <View className="flex-row items-center">
          <MaterialIcons name="category" size={16} color="#666" />
          <Text className="ml-1 text-xs text-gray-500">{item.category || "Uncategorized"}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-100">
      <View className="p-4 bg-white border-b border-gray-200 flex-row justify-between items-center">
        <Text className="text-2xl font-bold text-black">My Projects</Text>
        <TouchableOpacity onPress={handleLogout} className="flex-row items-center">
          <MaterialIcons name="logout" size={24} color="#FF3B30" />
          <Text className="ml-2 text-red-500 font-medium">Logout</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={data.getProjectsByLeadId}
        renderItem={renderProjectCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </View>
  );
}
