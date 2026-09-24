import { useMemo, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  View,
} from "react-native";
import { styled } from "nativewind";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import SubscriptionCard from "@/components/SubscriptionCard";
import { HOME_SUBSCRIPTIONS } from "@/constants/data";
import { colors, components } from "@/constants/theme";

const SafeAreaView = styled(RNSafeAreaView);
const tabBar = components.tabBar;

/** Checks whether a subscription's name, category, or plan contains the query. */
function matchesQuery(subscription: Subscription, query: string) {
  const haystack = [subscription.name, subscription.category, subscription.plan]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return haystack.includes(query);
}

/** Renders a searchable list of dummy subscriptions. */
export default function Subscriptions() {
  const [query, setQuery] = useState("");
  const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<string | null>(null);
  const normalizedQuery = query.trim().toLowerCase();

  const filteredSubscriptions = useMemo(() => {
    if (!normalizedQuery) {
      return HOME_SUBSCRIPTIONS;
    }

    return HOME_SUBSCRIPTIONS.filter((subscription) =>
      matchesQuery(subscription, normalizedQuery)
    );
  }, [normalizedQuery]);

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === "ios" ? 8 : 0}
      >
        <FlatList
          ListHeaderComponent={
            <>
              <Text className="mb-5 text-3xl font-sans-bold text-primary">Subscriptions</Text>
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Search subscriptions"
                placeholderTextColor={colors.mutedForeground}
                className="search-field"
                autoCapitalize="none"
                autoCorrect={false}
                clearButtonMode="while-editing"
              />
            </>
          }
          data={filteredSubscriptions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SubscriptionCard
              {...item}
              expanded={expandedSubscriptionId === item.id}
              onPress={() => {
                setExpandedSubscriptionId((currentId) =>
                  currentId === item.id ? null : item.id
                );
              }}
            />
          )}
          extraData={expandedSubscriptionId}
          ItemSeparatorComponent={() => <View className="h-4" />}
          contentContainerStyle={{
            paddingBottom: tabBar.height + tabBar.horizontalInset + 20,
          }}
          automaticallyAdjustKeyboardInsets
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text className="home-empty-state">
              {normalizedQuery ? "No matching subscriptions" : "No subscriptions yet"}
            </Text>
          }
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
