import React from 'react';
import { Stack} from 'expo-router';
import { ApolloProvider } from '@apollo/client';
import client from "../../controller/apoloclient";

const ManagerLayout = () => {
  return (
    <ApolloProvider client={client}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      </Stack>
    </ApolloProvider>
  );
};

export default ManagerLayout;
