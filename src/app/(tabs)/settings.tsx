import { View, Text } from 'react-native'
import React from 'react'
import { styled } from "nativewind";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

/** Renders the placeholder content for the Settings tab. */
const settings = () => {
  return (
    <SafeAreaView className="flex-1 p-5 bg-background">
      <Text>settings</Text>
    </SafeAreaView>
  )
}

export default settings
