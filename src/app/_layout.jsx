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
      if (role === 'Project_Manager') {
        router.replace('/ProjectManager/welcome');
      }
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  return (
    <ApolloProvider client={client}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="login" />
        <Stack.Screen 
          name="ProjectManager" 
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen name="TeamLead" />
        <Stack.Screen name="TeamMember" />
      </Stack>
    </ApolloProvider>
  );
};

export default RootLayout;
