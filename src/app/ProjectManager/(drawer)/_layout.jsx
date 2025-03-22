import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Drawer } from "expo-router/drawer";
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { router } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';

const CustomDrawerContent = (props) => {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const getUserData = async () => {
            try {
                const id = await AsyncStorage.getItem('id');
                const username = await AsyncStorage.getItem('username');
                const role = await AsyncStorage.getItem('role');
                setUserData({ id, username, role });
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        getUserData();
    }, []);

    const handleLogout = async () => {
        try {
            await AsyncStorage.multiRemove(['id', 'token', 'role', 'username']);
            router.replace('/login');
        } catch (error) {
            console.error('Logout error:', error);
            router.replace('/login');
        }
    };

    return (
        <DrawerContentScrollView {...props}>
            <View className="flex-1">
                {/* User Profile Section */}
                <View className="p-4 border-b border-gray-200">
                    <View className="flex-row items-center">
                        <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center">
                            <MaterialIcons name="person" size={24} color="#3B82F6" />
                        </View>
                        <View className="ml-3">
                            <Text className="text-lg font-semibold text-gray-800">
                                {userData?.username || 'User'}
                            </Text>
                            <Text className="text-sm text-gray-600">
                                {userData?.role || 'Role'}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Navigation Items */}
                <View className="py-2">
                    <DrawerItem
                        icon={({ color }) => (
                            <MaterialIcons name="home" size={24} color={color} />
                        )}
                        label="Dashboard"
                        onPress={() => router.replace('/ProjectManager/welcome')}
                        labelStyle={{ fontSize: 16 }}
                    />

                    <DrawerItem
                        icon={({ color }) => (
                            <MaterialIcons name="folder" size={24} color={color} />
                        )}
                        label="My Projects"
                        onPress={() => router.push('/ProjectManager/(drawer)/projects')}
                        labelStyle={{ fontSize: 16 }}
                    />

                    <DrawerItem
                        icon={({ color }) => (
                            <MaterialIcons name="task" size={24} color={color} />
                        )}
                        label="My Tasks"
                        onPress={() => router.push('/ProjectManager/(drawer)/tasks')}
                        labelStyle={{ fontSize: 16 }}
                    />

                    <DrawerItem
                        icon={({ color }) => (
                            <MaterialIcons name="people" size={24} color={color} />
                        )}
                        label="Team Members"
                        onPress={() => router.push('/ProjectManager/(drawer)/team')}
                        labelStyle={{ fontSize: 16 }}
                    />

                    <DrawerItem
                        icon={({ color }) => (
                            <MaterialIcons name="notifications" size={24} color={color} />
                        )}
                        label="Notifications"
                        onPress={() => router.push('/ProjectManager/(drawer)/notifications')}
                        labelStyle={{ fontSize: 16 }}
                    />

                    <DrawerItem
                        icon={({ color }) => (
                            <MaterialIcons name="settings" size={24} color={color} />
                        )}
                        label="Settings"
                        onPress={() => router.push('/ProjectManager/(drawer)/settings')}
                        labelStyle={{ fontSize: 16 }}
                    />
                </View>

                {/* Logout Button */}
                <TouchableOpacity 
                    onPress={handleLogout}
                    className="absolute bottom-0 left-0 right-0 p-4 bg-red-50 flex-row items-center justify-center"
                >
                    <MaterialIcons name="logout" size={24} color="#EF4444" />
                    <Text className="text-red-600 ml-2 font-semibold">Logout</Text>
                </TouchableOpacity>
            </View>
        </DrawerContentScrollView>
    );
};

const DrawerNav = () => {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Drawer
                drawerContent={(props) => <CustomDrawerContent {...props} />}
                screenOptions={{
                    headerTitle: "Project Manager",
                    headerStyle: {
                        backgroundColor: '#3B82F6',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    drawerStyle: {
                        backgroundColor: '#fff',
                        width: 280,
                    },
                    drawerLabelStyle: {
                        color: '#1F2937',
                    },
                    drawerActiveTintColor: '#3B82F6',
                }}
            />
        </GestureHandlerRootView>
    );
};

export default DrawerNav;