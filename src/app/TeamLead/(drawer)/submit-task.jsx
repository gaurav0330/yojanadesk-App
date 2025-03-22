import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { gql, useMutation } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';

const CREATE_TASK = gql`
  mutation CreateTask(
    $title: String!
    $description: String!
    $project: ID!
    $createdBy: ID!
    $assignedTo: ID!
    $priority: String!
    $dueDate: String!
  ) {
    createTask(
      title: $title
      description: $description
      project: $project
      createdBy: $createdBy
      assignedTo: $assignedTo
      priority: $priority
      dueDate: $dueDate
    ) {
      id
      title
      description
      status
      priority
      dueDate
    }
  }
`;

export default function SubmitTask() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [dueDate, setDueDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [teamLeadId, setTeamLeadId] = useState(null);
  const [projectId, setProjectId] = useState(null);

  React.useEffect(() => {
    const fetchIds = async () => {
      try {
        const storedLeadId = await AsyncStorage.getItem("id");
        const storedProjectId = await AsyncStorage.getItem("currentProjectId");
        if (storedLeadId) setTeamLeadId(storedLeadId);
        if (storedProjectId) setProjectId(storedProjectId);
      } catch (error) {
        console.error("Error fetching IDs:", error);
      }
    };
    fetchIds();
  }, []);

  const [createTask, { loading }] = useMutation(CREATE_TASK);

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Error', 'Please enter a task description');
      return;
    }

    if (!teamLeadId || !projectId) {
      Alert.alert('Error', 'Missing required information');
      return;
    }

    try {
      const { data } = await createTask({
        variables: {
          title: title.trim(),
          description: description.trim(),
          project: projectId,
          createdBy: teamLeadId,
          assignedTo: teamLeadId,
          priority,
          dueDate: dueDate.toISOString(),
        },
      });

      if (data?.createTask) {
        Alert.alert('Success', 'Task created successfully');
        setTitle('');
        setDescription('');
        setPriority('MEDIUM');
        setDueDate(new Date());
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to create task');
      console.error('Error creating task:', error);
    }
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDueDate(selectedDate);
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-100">
      <View className="p-4 bg-white border-b border-gray-200">
        <Text className="text-2xl font-bold text-black">Submit New Task</Text>
      </View>

      <View className="p-4">
        <View className="mb-4">
          <Text className="text-gray-700 font-medium mb-2">Task Title</Text>
          <TextInput
            className="bg-white p-3 rounded-lg border border-gray-300"
            value={title}
            onChangeText={setTitle}
            placeholder="Enter task title"
            placeholderTextColor="#666"
          />
        </View>

        <View className="mb-4">
          <Text className="text-gray-700 font-medium mb-2">Description</Text>
          <TextInput
            className="bg-white p-3 rounded-lg border border-gray-300 h-32 text-align-top"
            value={description}
            onChangeText={setDescription}
            placeholder="Enter task description"
            placeholderTextColor="#666"
            multiline
          />
        </View>

        <View className="mb-4">
          <Text className="text-gray-700 font-medium mb-2">Priority</Text>
          <View className="flex-row space-x-2">
            {['LOW', 'MEDIUM', 'HIGH'].map((p) => (
              <TouchableOpacity
                key={p}
                className={`flex-1 p-3 rounded-lg ${
                  priority === p ? 'bg-blue-500' : 'bg-gray-200'
                }`}
                onPress={() => setPriority(p)}
              >
                <Text
                  className={`text-center font-medium ${
                    priority === p ? 'text-white' : 'text-gray-700'
                  }`}
                >
                  {p}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="mb-4">
          <Text className="text-gray-700 font-medium mb-2">Due Date</Text>
          <TouchableOpacity
            className="bg-white p-3 rounded-lg border border-gray-300 flex-row justify-between items-center"
            onPress={() => setShowDatePicker(true)}
          >
            <Text className="text-gray-700">
              {dueDate.toLocaleDateString()}
            </Text>
            <MaterialIcons name="event" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={dueDate}
            mode="date"
            display="default"
            onChange={onDateChange}
            minimumDate={new Date()}
          />
        )}

        <TouchableOpacity
          className={`bg-blue-500 p-4 rounded-lg mt-4 ${
            loading ? 'opacity-50' : ''
          }`}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-center font-semibold text-lg">
              Submit Task
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
} 