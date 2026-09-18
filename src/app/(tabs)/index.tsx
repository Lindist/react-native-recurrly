import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-background">
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
    </View>
  );
}
