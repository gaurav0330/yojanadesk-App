import { TouchableOpacity, Text } from 'react-native'

const MyButton = ({ title = 'Button', onPress, style = '' }) => {
  return (
    <TouchableOpacity 
      className={`bg-orange-500 px-20 py-3 rounded-md ${style}`} 
      onPress={onPress}
    >
      <Text className="text-white text-center text-lg">{title}</Text>
    </TouchableOpacity>
  )
}

export default MyButton
