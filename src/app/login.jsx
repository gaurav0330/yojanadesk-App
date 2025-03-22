import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { useMutation, gql } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MyButton from '../components/MyButon';

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      id
      email
      username
      role
      token
    }
  }
`;

const Login = () => {
  const [email, setEmail] = useState('@gmail.com');
  const [password, setPassword] = useState('111111');
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  const [login, { loading }] = useMutation(LOGIN_MUTATION, {
    onError: (error) => {
      setErrorMsg(error.message || 'Login failed. Please try again.');
      console.error('Login error:', error);
    }
  });

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMsg('Please enter both email and password');
      return;
    }
    
    setErrorMsg('');
    try {
      const { data } = await login({ 
        variables: { email, password },
        fetchPolicy: 'network-only' // Ensures fresh data
      });
      
      if (!data?.login) {
        setErrorMsg('Invalid credentials');
        return;
      }

      const { role, token, email: userEmail, username, id } = data.login;

      // Store all data in parallel for better performance
      await Promise.all([
        AsyncStorage.setItem('token', token),
        AsyncStorage.setItem('userRole', role),
        AsyncStorage.setItem('email', userEmail),
        AsyncStorage.setItem('username', username),
        AsyncStorage.setItem('id', id)
      ]);

      // Use replace instead of push for faster navigation
      switch (role) {
        case 'Project_Manager':
          router.replace('/ProjectManager/welcome');
          break;
        case 'Team_Lead':
          router.replace('/TeamLead/welcome');
          break;
        case 'Team_Member':
          router.replace('/TeamMember');
          break;
        default:
          setErrorMsg('Unknown role: ' + role);
      }
    } catch (err) {
      setErrorMsg('Network error. Please check your connection.');
      console.error('Login error:', err);
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-white p-6">
      <Text className="text-4xl font-bold text-blue-800 mb-8">Login</Text>

      <TextInput
        className="w-full border-2 border-gray-300 rounded-md p-3 mb-4"
        placeholder="Email"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setErrorMsg('');
        }}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!loading}
      />

      <TextInput
        className="w-full border-2 border-gray-300 rounded-md p-3 mb-6"
        placeholder="Password"
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          setErrorMsg('');
        }}
        secureTextEntry
        editable={!loading}
      />

      {loading ? (
        <View className="items-center">
          <ActivityIndicator size="large" color="#0000ff" className="mb-2" />
          <Text className="text-gray-600">Logging in...</Text>
        </View>
      ) : (
        <MyButton title="Login" onPress={handleLogin} />
      )}

      {errorMsg ? (
        <Text className="text-red-500 mt-2 text-center">{errorMsg}</Text>
      ) : null}

      <TouchableOpacity 
        onPress={() => router.push('/signup')} 
        className="mt-4"
        disabled={loading}
      >
        <Text className="text-blue-600">Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;
