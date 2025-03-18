import React from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useQuery, useMutation, gql } from '@apollo/client';

const GET_TASKS_FOR_MEMBER = gql`
  query GetTasksForMember($memberId: ID!, $projectId: ID!) {
    getTasksForMember(memberId: $memberId, projectId: $projectId) {
      id
      title
      description
      project
      createdBy
      assignedTo
      status
      priority
      dueDate
    }
  }
`;

const UPDATE_TASK_STATUS = gql`
  mutation UpdateTaskStatus($taskId: ID!, $status: String!) {
    updateTaskStatus(taskId: $taskId, status: $status) {
      success
      message
      task {
        id
        status
      }
    }
  }
`;

const SEND_TASK_FOR_APPROVAL = gql`
  mutation SendTaskForApproval($taskId: ID!) {
    sendTaskForApproval(taskId: $taskId) {
      success
      message
      task {
        id
        status
      }
    }
  }
`;

export default function ProjectTasks({ memberId, projectId }) {
  const { loading, error, data } = useQuery(GET_TASKS_FOR_MEMBER, {
    variables: { memberId, projectId },
    skip: !memberId || !projectId,
  });

  const [updateTaskStatus] = useMutation(UPDATE_TASK_STATUS);
  const [sendTaskForApproval] = useMutation(SEND_TASK_FOR_APPROVAL);

  const handleUpdateStatus = async (taskId) => {
    try {
      await updateTaskStatus({ variables: { taskId, status: "Done" } });
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handleSendForApproval = async (taskId) => {
    try {
      await sendTaskForApproval({ variables: { taskId } });
    } catch (error) {
      console.error('Error sending task for approval:', error);
    }
  };

  const renderTask = ({ item }) => {
    return (
      <View className="p-4 mb-3 bg-white border border-gray-200 shadow-md rounded-2xl">
        {/* Title */}
        <Text className="mt-2 text-lg font-bold text-gray-900">{item.title}</Text>

        {/* Description */}
        <Text className="mt-1 text-sm text-gray-600">{item.description}</Text>

        {/* Due Date */}
        <Text className="text-sm text-gray-500">⏳ {item.dueDate?.slice(0, 10)}</Text>

        {/* Status */}
        <Text className="mt-2 text-sm font-medium">
          ✅ Status: {item.status}
        </Text>

        {/* Action Buttons */}
        <View className="flex-row justify-between mt-4">
          {item.status.toLowerCase() !== "done" &&
            item.status.toLowerCase() !== "pending approval" &&
            item.status.toLowerCase() !== "completed" && (
              <TouchableOpacity
                className="px-4 py-2 bg-blue-600 rounded-lg"
                onPress={() => handleUpdateStatus(item.id)}
              >
                <Text className="font-medium text-white">Mark as Done</Text>
              </TouchableOpacity>
            )}

          {item.status.toLowerCase() === "done" && (
            <TouchableOpacity
              className="px-4 py-2 bg-green-600 rounded-lg"
              onPress={() => handleSendForApproval(item.id)}
            >
              <Text className="font-medium text-white">Send for Approval</Text>
            </TouchableOpacity>
          )}

          {item.status.toLowerCase() === "pending approval" && (
            <Text className="font-semibold text-yellow-600">
              ⏳ Pending Approval
            </Text>
          )}

          {item.status.toLowerCase() === "completed" && (
            <Text className="font-semibold text-green-600">
              🎉 Task Completed
            </Text>
          )}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View className="items-center justify-center flex-1 bg-gray-50">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="mt-4 text-gray-600">Loading tasks...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="items-center justify-center flex-1 p-4 bg-gray-50">
        <Text className="mt-2 text-lg text-center text-red-500">
          ⚠️ Error: {error.message}
        </Text>
      </View>
    );
  }

  const tasks = data?.getTasksForMember || [];

  return (
    <View className="flex-1 bg-gray-50">
      <View className="p-4 bg-white border-b border-gray-200">
        <Text className="text-xl font-bold text-gray-800">Project Tasks</Text>
      </View>

      {tasks.length > 0 ? (
        <FlatList
          data={tasks}
          renderItem={renderTask}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
        />
      ) : (
        <View className="items-center justify-center flex-1 p-4">
          <View className="w-full max-w-sm p-6 bg-white shadow-sm rounded-xl">
            <Text className="mb-2 text-lg text-center text-gray-600">
              No tasks assigned yet!
            </Text>
            <Text className="text-sm text-center text-gray-500">
              Your tasks will appear here once assigned.
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}
