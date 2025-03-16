import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Platform } from 'react-native';
import React, { useState } from 'react';
import { router } from 'expo-router';
import { useMutation, gql } from '@apollo/client';
import DateTimePicker from '@react-native-community/datetimepicker';

const CREATE_PROJECT = gql`
  mutation CreateProject(
    $title: String!
    $description: String
    $startDate: String!
    $endDate: String!
    $category: String
  ) {
    createProject(
      title: $title
      description: $description
      startDate: $startDate
      endDate: $endDate
      category: $category
    ) {
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

const CreateProject = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDate, setShowStartDate] = useState(false);
  const [showEndDate, setShowEndDate] = useState(false);
  const [error, setError] = useState('');

  const [createProject, { loading }] = useMutation(CREATE_PROJECT, {
    onCompleted: (data) => {
      router.push(`/ProjectManager/(drawer)/assignTeamLeads/${data.createProject.id}`);
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const handleStartDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setShowStartDate(Platform.OS === 'ios');
    setStartDate(currentDate); 
  };

  const handleEndDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || endDate;
    setShowEndDate(Platform.OS === 'ios');
    setEndDate(currentDate);
  };

  const handleSubmit = () => {
    if (!title || !description) {
      setError('Please fill in all required fields');
      return;
    }

    createProject({
      variables: {
        title,
        description,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        category,
      },
    });
  };

  return (
    <ScrollView className="flex-1 bg-white p-4">
      <View className="mb-6">
        <Text className="text-2xl font-bold text-gray-800 mb-4">Create New Project</Text>
        <Text className="text-gray-600">Fill in the project details below</Text>
      </View>

      <View className="space-y-4">
        <View>
          <Text className="text-gray-700 mb-2 font-medium">Project Title *</Text>
          <TextInput
            className="w-full border-2 border-gray-200 rounded-lg p-3 bg-white"
            value={title}
            onChangeText={setTitle}
            placeholder="Enter project title"
          />
        </View>

        <View>
          <Text className="text-gray-700 mb-2 font-medium">Description *</Text>
          <TextInput
            className="w-full border-2 border-gray-200 rounded-lg p-3 bg-white"
            value={description}
            onChangeText={setDescription}
            placeholder="Enter project description"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <View>
          <Text className="text-gray-700 mb-2 font-medium">Category</Text>
          <TextInput
            className="w-full border-2 border-gray-200 rounded-lg p-3 bg-white"
            value={category}
            onChangeText={setCategory}
            placeholder="Enter project category"
          />
        </View>

        <View>
          <Text className="text-gray-700 mb-2 font-medium">Start Date *</Text>
          <TouchableOpacity 
            className="w-full border-2 border-gray-200 rounded-lg p-3 bg-white"
            onPress={() => setShowStartDate(true)}
          >
            <Text>{startDate.toLocaleDateString()}</Text>
          </TouchableOpacity>
          {showStartDate && (
            <DateTimePicker
              testID="startDatePicker"
              value={startDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleStartDateChange}
            />
          )}
        </View>

        <View>
          <Text className="text-gray-700 mb-2 font-medium">End Date *</Text>
          <TouchableOpacity 
            className="w-full border-2 border-gray-200 rounded-lg p-3 bg-white"
            onPress={() => setShowEndDate(true)}
          >
            <Text>{endDate.toLocaleDateString()}</Text>
          </TouchableOpacity>
          {showEndDate && (
            <DateTimePicker
              testID="endDatePicker"
              value={endDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleEndDateChange}
            />
          )}
        </View>

        {error ? (
          <Text className="text-red-500 text-center">{error}</Text>
        ) : null}

        <TouchableOpacity
          className="bg-blue-600 py-3 rounded-lg mt-6"
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-center font-semibold text-lg">
              Create Project
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default CreateProject; 