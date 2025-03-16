import { View, Text } from 'react-native'
import React from 'react'
import {Drawer} from "expo-router/drawer";
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { router } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const CustomDrawerContent = (props) => {
    return(
    <DrawerContentScrollView {...props}>
       <DrawerItem label="Settings" onPress={() => router.push('./(tabs)/settings')} />
       <DrawerItem 
           label="Contact" 
           onPress={() => router.push('/ProjectManager/(drawer)/contact')} 
       />
       <DrawerItem label="Create Project" onPress={() => router.push('/ProjectManager/(drawer)/CreateProject')} />
    </DrawerContentScrollView>
    );
};

const DrawerNav = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
   <Drawer drawerContent={(props) => <CustomDrawerContent {...props} />} />
   </GestureHandlerRootView>
  )
}

export default DrawerNav