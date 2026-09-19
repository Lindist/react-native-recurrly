import { View, Text } from 'react-native'
import React from 'react'
import { Link } from "expo-router";
import { styled } from "nativewind";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

/** Renders the sign-up route with links to sign-in and home. */
const Signup = () => {
  return (
    <SafeAreaView className="flex-1 p-5 bg-background">
      <Text>signup</Text>
      <Link href="/(auth)/signin" className="mt-4 rounded bg-success px-4 py-2">
        <Text className="text-white">Go to Signin</Text>
      </Link>
      <Link href="/" className="mt-4 rounded bg-black px-4 py-2">
        <Text className="text-white">Back to Home</Text>
      </Link>
    </SafeAreaView>
  )
}

export default Signup
