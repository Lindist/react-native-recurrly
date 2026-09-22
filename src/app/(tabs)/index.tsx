import { Text, View,Image, FlatList } from "react-native";
import { styled } from "nativewind";
import images from "@/constants/images";
import {HOME_BALANCE, HOME_SUBSCRIPTIONS, HOME_USER, UPCOMING_SUBSCRIPTIONS} from "@/constants/data";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { icons } from "@/constants/icon";
import { components } from "@/constants/theme";
import { formatCurrency } from "@/lib/utils";
import dayjs from "dayjs";
import ListHeading from "@/components/ListHeading";
import UpcomingSubscriptionCard from "@/components/UpcomingSubscriptionCard";
import SubscriptionCard from "@/components/SubscriptionCard";
import { useState } from "react";
import { posthog } from "@/lib/posthog";


const SafeAreaView = styled(RNSafeAreaView);
const tabBar = components.tabBar;

/** Renders the home route with links to onboarding, authentication, and subscription details. */
export default function App() {
  const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<string | null>(null);
  return (
    <SafeAreaView className="flex-1 p-5 bg-background">
      <FlatList
        ListHeaderComponent={() => (
          <>
            <View className="home-header">
              <View className="home-user">
                <Image source={images.avatar} className="home-avatar" />
                <Text className="home-user-name">
                  {HOME_USER.name}
                </Text>
              </View>
              <Image source={icons.add} className="home-add-icon" />
            </View>
            <View className="home-balance-card">
              <Text className="text-lg font-sans-semibold text-white">Balance</Text>
              <View className="flex-row items-center justify-between gap-2">
                <Text className="home-balance-amount">
                  {formatCurrency(HOME_BALANCE.amount)}
                </Text>
                <Text className="home-balance-date">
                  {dayjs(HOME_BALANCE.nextRenewalDate).format("MM/DD")}
                </Text>
              </View>
            </View>

            <View className="mb-5">
              <ListHeading title="Upcoming" />
              <FlatList
                data={UPCOMING_SUBSCRIPTIONS}
                renderItem={({ item }) => <UpcomingSubscriptionCard {...item} />}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 5 }}
                ListEmptyComponent={<Text className="home-empty-state">No upcoming renewals yet</Text>}
              />
            </View>
            <ListHeading title="All Subscriptions" />
          </>
        )}
        data={HOME_SUBSCRIPTIONS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SubscriptionCard
            {...item} 
            expanded={expandedSubscriptionId === item.id} 
            onPress={() => {
              const isExpanding = expandedSubscriptionId !== item.id;
              setExpandedSubscriptionId((currentId) =>
                (currentId === item.id ? null : item.id)
              );

              if (isExpanding) {
                posthog?.capture("subscription_expanded");
              }
            }}
          />
        )}
        extraData={expandedSubscriptionId}
        ItemSeparatorComponent={() => <View className="h-4" />}
        contentContainerStyle={{
          paddingBottom: tabBar.height + tabBar.horizontalInset + 20,
        }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text className="home-empty-state">No subscriptions yet</Text>}
      />
    </SafeAreaView>
  );
}
