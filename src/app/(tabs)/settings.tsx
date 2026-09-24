import { useClerk, useUser } from "@clerk/expo";
import { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import images from "@/constants/images";
import { posthog } from "@/lib/posthog";

/** Renders account details and the sign-out action. */
export default function Settings() {
  const { signOut } = useClerk();
  const { user } = useUser();
  const [signingOut, setSigningOut] = useState(false);

  const primaryEmail = user?.primaryEmailAddress?.emailAddress;
  const displayName = user?.fullName || user?.firstName || "Your account";

  /** Signs out the current user and clears the analytics identity. */
  async function handleSignOut() {
    setSigningOut(true);

    try {
      await signOut();
      posthog?.capture("user_signed_out");
      posthog?.reset();
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text className="mb-5 text-3xl font-sans-bold text-primary">Settings</Text>

      <View className="rounded-2xl border border-border bg-card p-5">
        <View className="flex-row items-center gap-4">
          <Image source={images.avatar} className="size-16 rounded-full" />
          <View className="min-w-0 flex-1">
            <Text className="text-xl font-sans-bold text-primary" numberOfLines={1}>
              {displayName}
            </Text>
            <Text
              className="mt-1 text-sm font-sans-medium text-muted-foreground"
              numberOfLines={1}
            >
              {primaryEmail || "Signed in to Recurly"}
            </Text>
          </View>
        </View>

        <View className="my-5 h-px bg-border" />

        <Text className="text-base font-sans-semibold text-primary">
          Your subscriptions stay private to this account.
        </Text>
        <Text className="mt-2 text-sm font-sans-medium text-muted-foreground">
          Sign out when you are done managing renewals on a shared device.
        </Text>

        <Pressable
          className="mt-6 items-center rounded-2xl bg-primary py-4 disabled:opacity-50"
          disabled={signingOut}
          onPress={handleSignOut}
        >
          <Text className="font-sans-bold text-background">
            {signingOut ? "Signing out..." : "Sign out"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
