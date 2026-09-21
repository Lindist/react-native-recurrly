import clsx from "clsx";
import type { ReactNode } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  type TextInputProps,
  View,
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";
import { colors } from "@/constants/theme";

const SafeAreaView = styled(RNSafeAreaView);

export type AuthFieldErrors = {
  email?: string;
  password?: string;
  code?: string;
  form?: string;
};

type AuthShellProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

type AuthTextInputProps = TextInputProps & {
  label: string;
  error?: string;
};

type AuthButtonProps = {
  children: ReactNode;
  disabled?: boolean;
  loading?: boolean;
  onPress: () => void;
  variant?: "primary" | "secondary";
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export function isValidEmail(value: string) {
  return emailPattern.test(normalizeEmail(value));
}

export function getClerkFieldErrors(error: unknown): AuthFieldErrors {
  const fieldErrors: AuthFieldErrors = {};
  const maybeErrors = (error as { errors?: unknown[] })?.errors;

  if (!Array.isArray(maybeErrors)) {
    return { form: "Something went wrong. Please try again." };
  }

  for (const item of maybeErrors) {
    const clerkError = item as {
      code?: string;
      longMessage?: string;
      message?: string;
      meta?: { paramName?: string };
    };
    const message = clerkError.longMessage || clerkError.message || "Please check this field.";
    const code = clerkError.code || "";
    const paramName = clerkError.meta?.paramName || "";
    const target = `${code} ${paramName}`.toLowerCase();

    if (target.includes("password")) {
      fieldErrors.password = message;
    } else if (
      target.includes("identifier") ||
      target.includes("email_address") ||
      target.includes("email")
    ) {
      fieldErrors.email = message;
    } else if (
      target.includes("verification") ||
      target.includes("code") ||
      target.includes("ticket")
    ) {
      fieldErrors.code = message;
    } else if (!fieldErrors.form) {
      fieldErrors.form = message;
    }
  }

  return fieldErrors.form || fieldErrors.email || fieldErrors.password || fieldErrors.code
    ? fieldErrors
    : { form: "Something went wrong. Please try again." };
}

export function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    <SafeAreaView className="auth-safe-area" style={{ backgroundColor: colors.background }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="auth-screen"
        style={{ backgroundColor: colors.background }}
      >
        <ScrollView
          className="auth-scroll"
          contentContainerClassName="auth-content"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="auth-brand-block">
            <View className="auth-logo-wrap">
              <View className="auth-logo-mark rounded-bl-[26px] rounded-tr-[26px]">
                <Text className="auth-logo-mark-text">R</Text>
              </View>
              <View>
                <Text className="auth-wordmark">Recurly</Text>
                <Text className="auth-wordmark-sub">Smart Billing</Text>
              </View>
            </View>
            <Text className="auth-title">{title}</Text>
            <Text className="auth-subtitle">{subtitle}</Text>
          </View>

          <View className="auth-card">{children}</View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export function AuthTextInput({ label, error, className, ...props }: AuthTextInputProps) {
  return (
    <View className="auth-field">
      <Text className="auth-label">{label}</Text>
      <TextInput
        {...props}
        className={clsx("auth-input", error && "auth-input-error", className)}
        placeholderTextColor="rgba(8, 17, 38, 0.5)"
      />
      {error ? <Text className="auth-error">{error}</Text> : null}
    </View>
  );
}

export function AuthButton({
  children,
  disabled,
  loading,
  onPress,
  variant = "primary",
}: AuthButtonProps) {
  const secondary = variant === "secondary";

  return (
    <Pressable
      className={clsx(
        secondary ? "auth-secondary-button" : "auth-button",
        disabled && !secondary && "auth-button-disabled",
        disabled && secondary && "opacity-50"
      )}
      disabled={disabled || loading}
      onPress={onPress}
    >
      {loading ? (
        <ActivityIndicator color={secondary ? "#ea7a53" : "#081126"} />
      ) : (
        <Text className={secondary ? "auth-secondary-button-text" : "auth-button-text"}>
          {children}
        </Text>
      )}
    </Pressable>
  );
}

export function PasswordField({
  error,
  label = "Password",
  value,
  visible,
  onToggleVisible,
  onChangeText,
  placeholder,
}: {
  error?: string;
  label?: string;
  value: string;
  visible: boolean;
  onToggleVisible: () => void;
  onChangeText: (value: string) => void;
  placeholder: string;
}) {
  return (
    <View className="auth-field">
      <Text className="auth-label">{label}</Text>
      <View
        className={clsx(
          "flex-row items-center rounded-2xl border border-border bg-background",
          error && "border-destructive"
        )}
      >
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          className="min-w-0 flex-1 px-4 py-4 text-base font-sans-medium text-primary"
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="rgba(8, 17, 38, 0.5)"
          secureTextEntry={!visible}
          textContentType="password"
          value={value}
        />
        <Pressable className="px-4 py-3" onPress={onToggleVisible}>
          <Text className="text-sm font-sans-bold text-accent">
            {visible ? "Hide" : "Show"}
          </Text>
        </Pressable>
      </View>
      {error ? <Text className="auth-error">{error}</Text> : null}
    </View>
  );
}
