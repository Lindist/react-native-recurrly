import { View, Text } from 'react-native'
import React from 'react'
import { Link } from "expo-router";

const Signin = () => {
  return (
    <View>
      <Text>signin</Text>
      <Link href="/(auth)/signup" className="mt-4 rounded bg-success px-4 py-2">
        <Text className="text-white">Go to Signup</Text>
      </Link>
      <Link href="/" className="mt-4 rounded bg-black px-4 py-2">
        <Text className="text-white">Back to Home</Text>
      </Link>
    </View>
  )
}

export default Signin