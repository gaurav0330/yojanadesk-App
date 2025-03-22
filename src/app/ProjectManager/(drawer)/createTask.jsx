import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Platform } from 'react-native';
import React, { useState } from 'react';
import { useMutation, useQuery, gql } from '@apollo/client';
import { router, useLocalSearchParams } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialIcons } from '@expo/vector-icons';

// Query to get team leads
const GET_TEAM_LEADS = gql`
  query GetLeadsByProjectId($projectId: ID!) {
    getLeadsByProjectId(projectId: $projectId) {
      success
      message
      teamLeads {
        user {
          id
          username
          email
        }
        leadRole
      }
    }
  }
`;

// Mutation for creating task
const ASSIGN_TASK = gql`
  mutation AssignTask(
    $projectId: ID!
    $title: String!
    $description: String
    $assignedTo: ID!
    $priority: String
    $dueDate: String
  ) {
    assignTask(
      projectId: $projectId
      title: $title
      description: $description
      assignedTo: $assignedTo
      priority: $priority
      dueDate: $dueDate
    ) {
      success
      message
      task {
        id
        title
        description
        status
        priority
        dueDate
      }
    }
  }
`;

const CreateTaskScreen = () => {
  const { projectId } = useLocalSearchParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [error, setError] = useState('');

  // Fetch team leads
  const { loading: leadsLoading, data: leadsData } = useQuery(GET_TEAM_LEADS, {
    variables: { projectId },
    skip: !projectId,
  });

  // Create task mutation
  const [assignTask, { loading: taskLoading }] = useMutation(ASSIGN_TASK, {
    onCompleted: (data) => {
      if (data.assignTask.success) {
        router.back();
      } else {
        setError(data.assignTask.message);
      }
    },
    onError: (error) => {
      setError(error.message);
    }
  });

  const handleSubmit = () => {
    if (!title || !assignedTo) {
      setError('Please fill in all required fields');
      return;
    }

    assignTask({
      variables: {
        projectId,
        title,
        description,
        assignedTo,
        priority,
        dueDate: dueDate.toISOString(),
      },
    });
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || dueDate;
    setShowDatePicker(Platform.OS === 'ios');
    setDueDate(currentDate);
  };

  if (leadsLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  const teamLeads = leadsData?.getLeadsByProjectId?.teamLeads || [];

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        <View className="flex-row items-center mb-6">
          <TouchableOpacity 
            onPress={() => router.back()}
            className="mr-4"
          >
            <MaterialIcons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-gray-800">Create New Task</Text>
        </View>

        {/* Title Input */}
        <View className="mb-4">
          <Text className="text-gray-700 font-medium mb-2">Title *</Text>
          <TextInput
            className="bg-white p-3 rounded-lg border border-gray-200"
            placeholder="Enter task title"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* Description Input */}
        <View className="mb-4">
          <Text className="text-gray-700 font-medium mb-2">Description</Text>
          <TextInput
            className="bg-white p-3 rounded-lg border border-gray-200"
            placeholder="Enter task description"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Assign To Dropdown */}
        <View className="mb-4">
          <Text className="text-gray-700 font-medium mb-2">Assign To *</Text>
          <View className="bg-white p-3 rounded-lg border border-gray-200">
            {teamLeads.map((lead) => (
              <TouchableOpacity
                key={lead.user.id}
                className={`p-2 rounded-lg mb-2 ${
                  assignedTo === lead.user.id ? 'bg-blue-50 border border-blue-200' : ''
                }`}
                onPress={() => setAssignedTo(lead.user.id)}
              >
                <Text className="font-medium text-gray-800">{lead.user.username}</Text>
                <Text className="text-sm text-gray-600">{lead.leadRole}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Priority Selection */}
        <View className="mb-4">
          <Text className="text-gray-700 font-medium mb-2">Priority</Text>
          <View className="flex-row space-x-2">
            {['Low', 'Medium', 'High'].map((p) => (
              <TouchableOpacity
                key={p}
                className={`flex-1 p-3 rounded-lg ${
                  priority === p ? 'bg-blue-500' : 'bg-white border border-gray-200'
                }`}
                onPress={() => setPriority(p)}
              >
                <Text
                  className={`text-center font-medium ${
                    priority === p ? 'text-white' : 'text-gray-800'
                  }`}
                >
                  {p}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Due Date */}
        <View className="mb-4">
          <Text className="text-gray-700 font-medium mb-2">Due Date</Text>
          <TouchableOpacity
            className="bg-white p-3 rounded-lg border border-gray-200 flex-row justify-between items-center"
            onPress={() => setShowDatePicker(true)}
          >
            <Text className="text-gray-800">
              {dueDate.toLocaleDateString()}
            </Text>
            <MaterialIcons name="calendar-today" size={24} color="#6B7280" />
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={dueDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
            />
          )}
        </View>

        {/* Error Message */}
        {error ? (
          <View className="bg-red-50 p-3 rounded-lg mb-4">
            <Text className="text-red-600">{error}</Text>
          </View>
        ) : null}

        {/* Submit Button */}
        <TouchableOpacity
          className={`bg-blue-500 p-4 rounded-lg ${
            taskLoading ? 'opacity-50' : ''
          }`}
          onPress={handleSubmit}
          disabled={taskLoading}
        >
          {taskLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-center font-medium text-lg">
              Create Task
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default CreateTaskScreen; 