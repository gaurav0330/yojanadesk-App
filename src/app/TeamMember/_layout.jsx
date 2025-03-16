import React from 'react';
import { Stack } from 'expo-router';
import { ApolloProvider } from '@apollo/client';
import client from "../../controller/apoloclient";

const TeamMemberLayout = () => {
  return (
    <ApolloProvider client={client}>
      <Stack screenOptions={{ 
        headerShown: false,
        animation: 'slide_from_right'
      }}>
        <Stack.Screen 
          name="(drawer)"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </ApolloProvider>
  );
};

export default TeamMemberLayout;
