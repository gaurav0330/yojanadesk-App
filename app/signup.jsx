import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import MyButton from '../components/MyButon';
import { useRouter } from 'expo-router';
import { useMutation, gql } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SIGNUP_MUTATION = gql`
  mutation Signup($username: String!, $email: String!, $password: String!, $role: UserRole!) {
    signup(username: $username, email: $email, password: $password, role: $role) {
      id
      username
      email
      role
      token
    }
  }
`;

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Project_Manager'); // Default role
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const [signupMutation] = useMutation(SIGNUP_MUTATION);

  const handleSignup = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await signupMutation({
        variables: { username, email, password, role },
      });

      const user = data.signup;

      // Store user data in AsyncStorage
      await AsyncStorage.setItem('token', user.token);
      await AsyncStorage.setItem('userRole', user.role);
      await AsyncStorage.setItem('username', user.username);
      await AsyncStorage.setItem('id', user.id); 
      await AsyncStorage.setItem('id', user.email);

      router.push('/ProjectManager'); // Redirect to Dashboard
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    router.push('/login');
  };

  return (
    <View className="flex-1 items-center justify-center bg-white p-6">
      <Text className="text-4xl font-bold text-blue-800 mb-8">Sign Up</Text>

      <TextInput
        className="w-full border-2 border-gray-300 rounded-md p-3 mb-4"
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        className="w-full border-2 border-gray-300 rounded-md p-3 mb-4"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        className="w-full border-2 border-gray-300 rounded-md p-3 mb-4"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Role Picker */}
      <Picker
        selectedValue={role}
        onValueChange={(itemValue) => setRole(itemValue)}
        style={{ width: '100%', marginBottom: 20, borderWidth: 1, borderColor: 'gray' }}
      >
        <Picker.Item label="Project Manager" value="Project_Manager" />
        <Picker.Item label="Team Lead" value="Team_Lead" />
        <Picker.Item label="Team Member" value="Team_Member" />
      </Picker>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <MyButton title="Sign Up" onPress={handleSignup} />
      )}

      {error && <Text className="text-red-500 mt-2">{error}</Text>}

      <Text className="mt-4 text-gray-500">
        Already have an account?{' '}
        <TouchableOpacity onPress={handleLoginRedirect}>
          <Text className="text-blue-600">Log In</Text>
        </TouchableOpacity>
      </Text>
    </View>
  );
};

export default Signup;
