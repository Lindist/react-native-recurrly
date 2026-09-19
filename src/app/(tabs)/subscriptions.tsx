import { View, Text } from 'react-native'
import React from 'react'
import { styled } from "nativewind";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

/** Renders the placeholder content for the Subscriptions tab. */
const subscriptions = () => {
  return (
    <SafeAreaView className="flex-1 p-5 bg-background">
      <Text>subscriptions</Text>
    </SafeAreaView>
  )
}

export default subscriptions
