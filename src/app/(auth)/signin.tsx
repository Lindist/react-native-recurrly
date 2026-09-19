import { View, Text } from 'react-native'
import React from 'react'
import { Link } from "expo-router";
import { styled } from "nativewind";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

/** Renders the sign-in route with links to sign-up and home. */
const Signin = () => {
  return (
    <SafeAreaView className="flex-1 p-5 bg-background">
      <Text>signin</Text>
      <Link href="/(auth)/signup" className="mt-4 rounded bg-success px-4 py-2">
        <Text className="text-white">Go to Signup</Text>
      </Link>
      <Link href="/" className="mt-4 rounded bg-black px-4 py-2">
        <Text className="text-white">Back to Home</Text>
      </Link>
    </SafeAreaView>
  )
}

export default Signin
