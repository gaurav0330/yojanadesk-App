import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create an http link
const httpLink = createHttpLink({
  uri: 'YOUR_GRAPHQL_API_ENDPOINT', // Replace with your actual GraphQL endpoint
});

// Create an auth link
const authLink = setContext(async (_, { headers }) => {
  try {
    // Get the token from AsyncStorage
    const token = await AsyncStorage.getItem('token');
    
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
      },
    };
  } catch (error) {
    console.error('Error getting token:', error);
    return {
      headers,
    };
  }
});

// Create the Apollo Client
export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'network-only',
    },
    query: {
      fetchPolicy: 'network-only',
    },
  },
}); 