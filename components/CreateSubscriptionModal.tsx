import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import clsx from "clsx";
import dayjs from "dayjs";
import { icons } from "@/constants/icon";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { components } from "@/constants/theme";
import { posthog } from "@/lib/posthog";

const CATEGORIES = [
  "Entertainment",
  "AI Tools",
  "Developer Tools",
  "Design",
  "Productivity",
  "Cloud",
  "Music",
  "Other",
];

const CATEGORY_COLORS: Record<string, string> = {
  "Entertainment": "#ffb6c1",
  "AI Tools": "#b8d4e3",
  "Developer Tools": "#e8def8",
  "Design": "#f5c542",
  "Productivity": "#b8e8d0",
  "Cloud": "#d0e8b8",
  "Music": "#e8b8d0",
  "Other": "#e0e0e0",
};

interface CreateSubscriptionModalProps {
  visible: boolean;
  onClose: () => void;
  onCreate: (subscription: any) => void;
}

/** Renders the form for creating a subscription and passing it to the caller. */
export default function CreateSubscriptionModal({
  visible,
  onClose,
  onCreate,
}: CreateSubscriptionModalProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [frequency, setFrequency] = useState<"Monthly" | "Yearly">("Monthly");
  const [category, setCategory] = useState("Other");
  const insets = useSafeAreaInsets();
  
  const tabBar = components.tabBar;
  const safeBottomPadding = tabBar.height + Math.max(insets.bottom, tabBar.horizontalInset) + 20;

  const isValid = name.trim().length > 0 && Number(price) > 0;

  /** Creates a valid subscription, records the event, and clears the form. */
  const handleSubmit = () => {
    if (!isValid) return;

    const startDate = dayjs();
    const renewalDate =
      frequency === "Monthly"
        ? startDate.add(1, "month")
        : startDate.add(1, "year");

    const newSubscription = {
      id: Math.random().toString(36).substr(2, 9),
      name: name.trim(),
      price: Number(price),
      currency: "USD",
      billing: frequency,
      category,
      status: "active",
      startDate: startDate.toISOString(),
      renewalDate: renewalDate.toISOString(),
      icon: icons.wallet,
      color: CATEGORY_COLORS[category] || CATEGORY_COLORS["Other"],
    };

    onCreate(newSubscription);

    posthog?.capture("subscription_created", {
      subscription_name: name.trim(),
      subscription_price: Number(price),
      subscription_frequency: frequency,
      subscription_category: category,
    });
    // Reset form
    setName("");
    setPrice("");
    setFrequency("Monthly");
    setCategory("Other");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="modal-overlay" style={{ zIndex: 9999, elevation: 9999 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="flex-1"
          style={{ justifyContent: "flex-end" }}
        >
          <View className="modal-container">
            <View className="modal-header">
              <Text className="modal-title">New Subscription</Text>
              <TouchableOpacity onPress={onClose} className="modal-close">
                <Text className="modal-close-text">×</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              className="modal-body"
              contentContainerStyle={{ paddingBottom: safeBottomPadding, gap: 20 }}
            >
              <View className="auth-field">
                <Text className="auth-label">Name</Text>
                <TextInput
                  className="auth-input"
                  placeholder="e.g. Netflix"
                  value={name}
                  onChangeText={setName}
                  placeholderTextColor="#999"
                />
              </View>

              <View className="auth-field">
                <Text className="auth-label">Price</Text>
                <TextInput
                  className="auth-input"
                  placeholder="0.00"
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="decimal-pad"
                  placeholderTextColor="#999"
                />
              </View>

              <View className="auth-field">
                <Text className="auth-label">Frequency</Text>
                <View className="picker-row">
                  <Pressable
                    className={clsx(
                      "picker-option",
                      frequency === "Monthly" && "picker-option-active"
                    )}
                    onPress={() => setFrequency("Monthly")}
                  >
                    <Text
                      className={clsx(
                        "picker-option-text",
                        frequency === "Monthly" && "picker-option-text-active"
                      )}
                    >
                      Monthly
                    </Text>
                  </Pressable>
                  <Pressable
                    className={clsx(
                      "picker-option",
                      frequency === "Yearly" && "picker-option-active"
                    )}
                    onPress={() => setFrequency("Yearly")}
                  >
                    <Text
                      className={clsx(
                        "picker-option-text",
                        frequency === "Yearly" && "picker-option-text-active"
                      )}
                    >
                      Yearly
                    </Text>
                  </Pressable>
                </View>
              </View>

              <View className="auth-field">
                <Text className="auth-label">Category</Text>
                <View className="category-scroll">
                  {CATEGORIES.map((cat) => (
                    <Pressable
                      key={cat}
                      className={clsx(
                        "category-chip",
                        category === cat && "category-chip-active"
                      )}
                      onPress={() => setCategory(cat)}
                    >
                      <Text
                        className={clsx(
                          "category-chip-text",
                          category === cat && "category-chip-text-active"
                        )}
                      >
                        {cat}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              <TouchableOpacity
                className={clsx(
                  "auth-button",
                  !isValid && "auth-button-disabled"
                )}
                disabled={!isValid}
                onPress={handleSubmit}
              >
                <Text className="auth-button-text">Create Subscription</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
