import { View, Text } from 'react-native'
import React from 'react'
import { Link } from "expo-router";

const Signup = () => {
  return (
    <View>
      <Text>signup</Text>
      <Link href="/(auth)/signin" className="mt-4 rounded bg-success px-4 py-2">
        <Text className="text-white">Go to Signin</Text>
      </Link>
      <Link href="/" className="mt-4 rounded bg-black px-4 py-2">
        <Text className="text-white">Back to Home</Text>
      </Link>
    </View>
  )
}

export default Signup