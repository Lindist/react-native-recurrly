import { ClerkProvider, useAuth, useUser } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { colors } from "@/constants/theme";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import * as SystemUI from "expo-system-ui";
import "../../global.css";
import { useFonts } from "expo-font";
import { useEffect, useRef } from "react";
import { Text, View } from "react-native";
import { PostHogProvider } from "posthog-react-native";
import { posthog } from "@/lib/posthog";

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: "index",
};

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

const stackScreenOptions = {
  headerShown: false,
  contentStyle: { backgroundColor: colors.background },
} as const;

function StatusScreen({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <View
      className="flex-1 items-center justify-center p-5"
      style={{ backgroundColor: colors.background }}
    >
      <Text className="text-center text-2xl font-sans-bold text-primary">{title}</Text>
      <Text className="mt-3 text-center text-base font-sans-medium text-muted-foreground">
        {subtitle}
      </Text>
    </View>
  );
}

function AppStack({ fontsLoaded }: { fontsLoaded: boolean }) {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const identifiedUserId = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (!user) {
      identifiedUserId.current = undefined;
      return;
    }

    if (identifiedUserId.current === user.id) {
      return;
    }

    posthog?.identify(user.id, {
      $set: {
        ...(user.primaryEmailAddress?.emailAddress
          ? { email: user.primaryEmailAddress.emailAddress }
          : {}),
        ...(user.fullName ? { name: user.fullName } : {}),
      },
    });
    identifiedUserId.current = user.id;
  }, [user]);

  useEffect(() => {
    if (fontsLoaded && isLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, isLoaded]);

  if (!isLoaded) {
    return (
      <StatusScreen
        title="Loading Recurly"
        subtitle="Preparing your secure account session."
      />
    );
  }

  return (
    <Stack screenOptions={stackScreenOptions}>
      <Stack.Screen name="index" />
      <Stack.Protected guard={!!isSignedIn}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="subscriptions/[id]" />
      </Stack.Protected>
      <Stack.Protected guard={!isSignedIn}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
      <Stack.Screen name="onboarding" />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "sans-regular": require("@/assets/fonts/PlusJakartaSans-Regular.ttf"),
    "sans-medium": require("@/assets/fonts/PlusJakartaSans-Medium.ttf"),
    "sans-semibold": require("@/assets/fonts/PlusJakartaSans-SemiBold.ttf"),
    "sans-extra-bold": require("@/assets/fonts/PlusJakartaSans-ExtraBold.ttf"),
    "sans-bold": require("@/assets/fonts/PlusJakartaSans-Bold.ttf"),
    "sans-light": require("@/assets/fonts/PlusJakartaSans-Light.ttf"),
  });

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(colors.background);
  }, []);

  useEffect(() => {
    if (fontsLoaded && !publishableKey) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, publishableKey]);

  if (!fontsLoaded) {
    return null;
  }

  if (!publishableKey) {
    return (
      <StatusScreen
        title="Recurly needs an auth key"
        subtitle="Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY to your environment and restart the app."
      />
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
        {posthog ? (
          <PostHogProvider client={posthog}>
            <AppStack fontsLoaded={fontsLoaded} />
          </PostHogProvider>
        ) : (
          <AppStack fontsLoaded={fontsLoaded} />
        )}
      </ClerkProvider>
    </View>
  );
}
