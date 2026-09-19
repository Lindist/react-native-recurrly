import { Link } from "expo-router";
import { Text, View } from "react-native";
import { styled } from "nativewind";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";


const SafeAreaView = styled(RNSafeAreaView);

/** Renders the home route with links to onboarding, authentication, and subscription details. */
export default function App() {
  return (
    <SafeAreaView className="flex-1 p-5 bg-background">
      <Text className="text-7xl font-bold font-sans-extra-bold text-black">Home</Text>

      <Link href="/onboarding" className="mt-4 rounded font-sans-bold bg-black px-4 py-2">
        <Text className="text-white">Go to Onboarding</Text>
      </Link>
      <Link href="/(auth)/signup" className="mt-4 rounded font-sans-bold bg-black px-4 py-2">
        <Text className="text-white">Go to Signup</Text>
      </Link>
      <Link href="/(auth)/signin" className="mt-4 rounded font-sans-bold bg-black px-4 py-2">
        <Text className="text-white">Go to Signin</Text>
      </Link>
    </SafeAreaView>
  );
}
