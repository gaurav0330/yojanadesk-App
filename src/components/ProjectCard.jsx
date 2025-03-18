import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';


const ProjectCard = ({ project, onSelect }) => {
  // const formatDate = (dateString) => {
  //   return format(new Date(dateString), 'MMM dd, yyyy');
  // };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-500';
      case 'in progress':
        return 'bg-blue-500';
      case 'pending':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <TouchableOpacity 
      onPress={() => onSelect(project)}
      className="p-4 mx-4 my-2 bg-white shadow-md rounded-xl active:opacity-70"
    >
      <View className="space-y-2">
        <Text className="text-lg font-bold text-gray-800">{project.title}</Text>
        <Text className="text-sm text-gray-600">{project.description}</Text>
        
        <View className="space-y-1">
          <View className="flex-row">
            <Text className="mr-2 font-semibold text-gray-700">Start Date:</Text>
            <Text className="text-gray-600">{project.startDate}</Text>
          </View>
          <View className="flex-row">
            <Text className="mr-2 font-semibold text-gray-700">End Date:</Text>
            <Text className="text-gray-600">{project.endDate}</Text>
          </View>
        </View>

        <View className="flex-row items-center justify-between mt-3">
          <View className="px-3 py-1 bg-gray-200 rounded-full">
            <Text className="text-xs text-gray-700">{project.category}</Text>
          </View>
          <View className={`px-3 py-1 rounded-full ${getStatusColor(project.status)}`}>
            <Text className="text-xs font-medium text-white">{project.status}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ProjectCard; 