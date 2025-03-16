import React, { useEffect, useState } from 'react';
import { Stack, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import './globals.css';
import { ApolloProvider } from '@apollo/client';
import client from '../controller/apoloclient';

const RootLayout = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  // Function to check the user's authentication status and role
  const checkAuthStatus = async () => {
    const token = await AsyncStorage.getItem('token');
    const role = await AsyncStorage.getItem('userRole');

    if (token && role) {
      setIsAuthenticated(true);
      handleRoleBasedRedirect(role); // Redirect based on role
    }
  };

  // Function to handle role-based redirection
  const handleRoleBasedRedirect = (role) => {
    switch (role) {
      case 'Project_Manager':
        router.replace('/ProjectManager');
        break;
      case 'Team_Lead':
        router.replace('/TeamLead');
        break;
      case 'Team_Member':
        router.replace('/TeamMember');
        break;
      default:
        console.warn('Unknown role:', role);
        router.replace('/login'); // Fallback to login page
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  return (
    <ApolloProvider client={client}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false }} />
        <Stack.Screen name="login" />
        <Stack.Screen name="ProjectManager" />
        <Stack.Screen name="TeamLead" />
        <Stack.Screen name="TeamMember" />
      </Stack>
    </ApolloProvider>
  );
};

export default RootLayout;
