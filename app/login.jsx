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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const [login, { loading, error }] = useMutation(LOGIN_MUTATION);

  const handleLogin = async () => {
    try {
      const { data } = await login({ variables: { email, password } });

      await AsyncStorage.setItem('token', data.login.token);
      await AsyncStorage.setItem('userRole', data.login.role);
      await AsyncStorage.setItem('email', data.login.email);
      await AsyncStorage.setItem('username', data.login.username);
      await AsyncStorage.setItem('id', data.login.id);

      router.push('/ProjectManager'); // Redirect to Dashboard
    } catch (err) {
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
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        className="w-full border-2 border-gray-300 rounded-md p-3 mb-6"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" className="mb-6" />
      ) : (
        <MyButton title="Login" onPress={handleLogin} />
      )}

      {error && <Text className="text-red-500 mt-2">{error.message}</Text>}

      <TouchableOpacity onPress={() => router.push('/signup')} className="mt-4">
        <Text className="text-blue-600">Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;
