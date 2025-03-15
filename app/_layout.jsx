import React, { useEffect, useState } from 'react';
import { Stack, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import './globals.css';
import { ApolloProvider } from '@apollo/client';
import client from '../controller/apoloclient';

const RootLayout = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  // Check if the user is already logged in
  const checkAuthStatus = async () => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      router.replace('/ProjectManager'); // Redirect to dashboard if token exists
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
      </Stack>
    </ApolloProvider>
  );
};

export default RootLayout;
