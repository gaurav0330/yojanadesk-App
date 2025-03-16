import { View, Text,Image } from 'react-native'
import { useRouter } from 'expo-router'
import MyButton from '../components/MyButon';

const Index = () => {
  const router = useRouter()

  return (
    <View className="flex-1 items-center justify-center bg-white">

      <Text className="text-6xl font-bold text-blue-800 mb-7">Welcome</Text>
      <Image  source={require('../../assets/images/icon.png')} style={{width: 200, height: 200, marginBottom: 20}} resizeMode='cover'/>
      <MyButton title="Login" onPress={() => router.push('/login')} />
    </View>
  )
}

export default Index
