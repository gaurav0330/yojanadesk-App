import React from 'react';
import { Stack} from 'expo-router';
import { ApolloProvider } from '@apollo/client';
import client from "../../controller/apoloclient";


const ManagerLayout = () => {
  return (
    <ApolloProvider client={client}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(drawer)"/>
       
      </Stack>
    </ApolloProvider>
  );
};

export default ManagerLayout;
