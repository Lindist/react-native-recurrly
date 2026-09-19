import { Link } from "expo-router";
import { Text, View } from "react-native";
import { styled } from "nativewind";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";


const SafeAreaView = styled(RNSafeAreaView);

/** Renders the home route with links to onboarding, authentication, and subscription details. */
export default function App() {
  return (
    <SafeAreaView className="flex-1 p-5 bg-background">
      <Text className="text-xl font-bold text-black">
        Welcome to Nativewind!
      </Text>
      <Link href="/onboarding" className="mt-4 rounded bg-black px-4 py-2">
        <Text className="text-white">Go to Onboarding</Text>
      </Link>
      <Link href="/(auth)/signup" className="mt-4 rounded bg-black px-4 py-2">
        <Text className="text-white">Go to Signup</Text>
      </Link>
      <Link href="/(auth)/signin" className="mt-4 rounded bg-black px-4 py-2">
        <Text className="text-white">Go to Signin</Text>
      </Link>
      <Link
        href={{ pathname: "/subscriptions/[id]", params: { id: "sport" } }}
        className="mt-4 rounded bg-black px-4 py-2"
      >
        <Text className="text-white">Go to Subscription Sport</Text>
      </Link>
    </SafeAreaView>
  );
}
