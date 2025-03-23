import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { useQuery, gql } from '@apollo/client';
import { useLocalSearchParams } from 'expo-router';

const GET_PROJECT_ANALYTICS = gql`
  query GetProjectAnalytics($projectId: ID!) {
    getProjectProgress(projectId: $projectId) {
      totalTasks
      completedTasks
      progressPercentage
    }
    getTaskStatusBreakdown(projectId: $projectId) {
      statusBreakdown {
        toDo
        inProgress
        needsRevision
        completed
      }
    }
    getTeamPerformance(projectId: $projectId) {
      teamId
      teamName
      totalTasksAssigned
      completedTasks
      completionRate
    }
  }
`;

const Reports = () => {
    const { projectId } = useLocalSearchParams();
    console.log(projectId);
    const { loading, error, data } = useQuery(GET_PROJECT_ANALYTICS, {
        variables: { projectId },
        skip: !projectId,
    });

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#3B82F6" />
            </View>
        );
    }

    if (error) {
        return (
            <View className="flex-1 justify-center items-center">
                <Text className="text-red-500">Error loading analytics</Text>
            </View>
        );
    }

    const projectProgress = data?.getProjectProgress;
    const taskBreakdown = data?.getTaskStatusBreakdown?.statusBreakdown;
    const teamPerformance = data?.getTeamPerformance;

    return (
        <ScrollView className="flex-1 bg-gray-50">
            <View className="p-4">
                {/* Header Section */}
                <View className="mb-6">
                    <Text className="text-2xl font-bold text-gray-800">Project Analytics</Text>
                    <Text className="text-gray-600 mt-1">View your project statistics and analytics</Text>
                </View>

                {/* Report Cards */}
                <View className="space-y-4">
                    {/* Project Progress Card */}
                    <View className="bg-white p-4 rounded-xl shadow-sm">
                        <View className="flex-row items-center mb-3">
                            <MaterialIcons name="insert-chart" size={24} color="#3B82F6" />
                            <Text className="text-lg font-semibold ml-2 text-gray-800">Project Progress</Text>
                        </View>
                        <View className="flex-row justify-between">
                            <View className="items-center">
                                <Text className="text-2xl font-bold text-blue-500">
                                    {projectProgress?.completedTasks || 0}
                                </Text>
                                <Text className="text-gray-600">Completed</Text>
                            </View>
                            <View className="items-center">
                                <Text className="text-2xl font-bold text-green-500">
                                    {projectProgress?.totalTasks || 0}
                                </Text>
                                <Text className="text-gray-600">Total</Text>
                            </View>
                            <View className="items-center">
                                <Text className="text-2xl font-bold text-orange-500">
                                    {Math.round(projectProgress?.progressPercentage || 0)}%
                                </Text>
                                <Text className="text-gray-600">Progress</Text>
                            </View>
                        </View>
                    </View>

                    {/* Task Status Card */}
                    <View className="bg-white p-4 rounded-xl shadow-sm">
                        <View className="flex-row items-center mb-3">
                            <MaterialIcons name="assignment" size={24} color="#3B82F6" />
                            <Text className="text-lg font-semibold ml-2 text-gray-800">Task Status</Text>
                        </View>
                        <View className="flex-row justify-between">
                            <View className="items-center">
                                <Text className="text-2xl font-bold text-purple-500">
                                    {taskBreakdown?.toDo || 0}
                                </Text>
                                <Text className="text-gray-600">To Do</Text>
                            </View>
                            <View className="items-center">
                                <Text className="text-2xl font-bold text-blue-500">
                                    {taskBreakdown?.inProgress || 0}
                                </Text>
                                <Text className="text-gray-600">In Progress</Text>
                            </View>
                            <View className="items-center">
                                <Text className="text-2xl font-bold text-green-500">
                                    {taskBreakdown?.completed || 0}
                                </Text>
                                <Text className="text-gray-600">Completed</Text>
                            </View>
                        </View>
                    </View>

                    {/* Team Performance Card */}
                    <View className="bg-white p-4 rounded-xl shadow-sm">
                        <View className="flex-row items-center mb-3">
                            <MaterialIcons name="groups" size={24} color="#3B82F6" />
                            <Text className="text-lg font-semibold ml-2 text-gray-800">Team Performance</Text>
                        </View>
                        <View className="space-y-3">
                            {teamPerformance?.map((team, index) => (
                                <View key={index} className="flex-row justify-between items-center">
                                    <Text className="text-gray-600">{team.teamName}</Text>
                                    <Text className="text-green-500 font-semibold">
                                        {Math.round(team.completionRate)}%
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

export default Reports; 