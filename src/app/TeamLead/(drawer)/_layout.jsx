import { View, Text, TouchableOpacity, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Drawer } from "expo-router/drawer";
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { router, useLocalSearchParams } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const CustomDrawerContent = (props) => {
    const [userData, setUserData] = useState(null);
    const windowHeight = Dimensions.get('window').height;
    const { projectId } = useLocalSearchParams();

    useEffect(() => {
        const getUserData = async () => {
            try {
                const userData = await AsyncStorage.getItem('user');
                if (userData) {
                    setUserData(JSON.parse(userData));
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        getUserData();
    }, []);

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('user');
            await AsyncStorage.removeItem('token');
            router.replace('/login');
        } catch (error) {
            console.error('Logout error:', error);
            router.replace('/login');
        }
    };

    const menuItems = [
        { icon: "home", label: "Dashboard", route: '/TeamLead/welcome' },
        { icon: "dashboard", label: "Project Dashboard", route: `/TeamLead/(drawer)/project/${projectId}` },
        { icon: "add-circle", label: "Submit Task", route: '/TeamLead/(drawer)/submit-task' },
        { icon: "people", label: "Team Members", route: '/TeamLead/(drawer)/team-members' },
        { icon: "notifications", label: "Notifications", route: '/TeamLead/(drawer)/notifications' },
        { icon: "assessment", label: "Reports", route: '/TeamLead/(drawer)/reports' },
        { icon: "settings", label: "Settings", route: '/TeamLead/(drawer)/settings' },
    ];

    return (
        <DrawerContentScrollView {...props} className="flex-1">
            <View style={{ minHeight: windowHeight }} className="flex-1 bg-white">
                {/* User Profile Section */}
                <LinearGradient
                    colors={['#3B82F6', '#2563EB']}
                    className="p-6 rounded-b-3xl"
                >
                    <View className="flex-row items-center mb-4">
                        <View className="w-16 h-16 bg-white rounded-full items-center justify-center shadow-md">
                            <MaterialIcons name="person" size={32} color="#3B82F6" />
                        </View>
                        <View className="ml-4">
                            <Text className="text-xl font-bold text-white">
                                {userData?.name || 'User'}
                            </Text>
                            <Text className="text-sm text-blue-100">
                                {userData?.role || 'Team Lead'}
                            </Text>
                        </View>
                    </View>
                </LinearGradient>

                {/* Navigation Items */}
                <View className="flex-1 px-2 py-4">
                    {menuItems.map((item, index) => (
                        <DrawerItem
                            key={index}
                            icon={({ color }) => (
                                <View className="bg-blue-50 w-10 h-10 rounded-full items-center justify-center">
                                    <MaterialIcons name={item.icon} size={24} color="#3B82F6" />
                                </View>
                            )}
                            label={item.label}
                            onPress={() => {
                                if (item.route.includes('welcome')) {
                                    router.replace(item.route);
                                } else {
                                    router.push(item.route);
                                }
                            }}
                            labelStyle={{ 
                                fontSize: 16, 
                                fontWeight: '600',
                                marginLeft: -16
                            }}
                            style={{
                                borderRadius: 12,
                                marginVertical: 4,
                            }}
                        />
                    ))}
                </View>

                {/* Logout Button */}
                <TouchableOpacity 
                    onPress={handleLogout}
                    className="mx-4 mb-8 p-4 bg-red-50 rounded-2xl flex-row items-center justify-center"
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
                    headerTitle: "Team Lead",
                    headerStyle: {
                        backgroundColor: '#3B82F6',
                        elevation: 0,
                        shadowOpacity: 0,
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                        fontSize: 20,
                    },
                    drawerStyle: {
                        backgroundColor: '#fff',
                        width: 320,
                        borderTopRightRadius: 24,
                        borderBottomRightRadius: 24,
                    },
                    drawerLabelStyle: {
                        color: '#1F2937',
                    },
                    drawerActiveTintColor: '#3B82F6',
                    drawerActiveBackgroundColor: '#EFF6FF',
                }}
            />
        </GestureHandlerRootView>
    );
};

export default DrawerNav; 