import { View, Text, Button } from 'react-native'
import React from 'react'
import { router } from 'expo-router'

const Settings = () => {
  return (
    <View>
      <Text>Settings</Text>
      <Button title="Contact" onPress={() => router.push('/ProjectManager/contact')} />
    </View>
  )
}

export default Settings