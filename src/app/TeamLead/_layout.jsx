import React from 'react';
import { Stack } from 'expo-router';
import { ApolloProvider } from '@apollo/client';
import client from "../../controller/apoloclient";

const TeamLeadLayout = () => {
  return (
    <ApolloProvider client={client}>
      <Stack 
        screenOptions={{ 
          headerShown: false,
          animation: 'slide_from_right'
        }}
      >
        <Stack.Screen 
          name="welcome" 
          options={{ 
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen 
          name="(drawer)"
          options={{
            animation: 'slide_from_right',
          }}
        />
      </Stack>
    </ApolloProvider>
  );
};

export default TeamLeadLayout; 