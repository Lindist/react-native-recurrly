import { useSignIn } from "@clerk/expo/legacy";
import { Link } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import {
  AuthButton,
  AuthShell,
  AuthTextInput,
  getClerkFieldErrors,
  isValidEmail,
  normalizeEmail,
  PasswordField,
  type AuthFieldErrors,
} from "@/components/auth/AuthForm";
import { posthog } from "@/lib/posthog";

/** Renders the sign-in form and records successful sign-ins. */
export default function SignIn() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errors, setErrors] = useState<AuthFieldErrors>({});
  const [submitting, setSubmitting] = useState(false);

  /** Validates credentials and activates a completed sign-in session. */
  async function handleSignIn() {
    const nextErrors: AuthFieldErrors = {};
    const emailAddress = normalizeEmail(email);

    if (!isValidEmail(emailAddress)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!password) {
      nextErrors.password = "Enter your password.";
    }

    setErrors(nextErrors);

    if (nextErrors.email || nextErrors.password || !isLoaded) {
      return;
    }

    setSubmitting(true);

    try {
      const result = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        posthog?.capture("user_signed_in");
        return;
      }

      setErrors({
        form: "This account needs another sign-in step. Open your account settings to enable email and password access.",
      });
    } catch (error) {
      setErrors(getClerkFieldErrors(error));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to continue managing your subscriptions"
    >
      <View className="auth-form">
        <AuthTextInput
          autoCapitalize="none"
          autoComplete="email"
          autoCorrect={false}
          error={errors.email}
          inputMode="email"
          keyboardType="email-address"
          label="Email"
          onChangeText={(value) => {
            setEmail(value);
            setErrors((current) => ({ ...current, email: undefined, form: undefined }));
          }}
          onSubmitEditing={handleSignIn}
          placeholder="Enter your email"
          returnKeyType="next"
          textContentType="emailAddress"
          value={email}
        />

        <PasswordField
          error={errors.password}
          onChangeText={(value) => {
            setPassword(value);
            setErrors((current) => ({ ...current, password: undefined, form: undefined }));
          }}
          onToggleVisible={() => setPasswordVisible((current) => !current)}
          placeholder="Enter your password"
          value={password}
          visible={passwordVisible}
        />

        {errors.form ? <Text className="auth-error">{errors.form}</Text> : null}

        <AuthButton
          disabled={!email || !password || !isLoaded}
          loading={submitting}
          onPress={handleSignIn}
        >
          Sign in
        </AuthButton>
      </View>

      <View className="auth-link-row">
        <Text className="auth-link-copy">New to Recurly?</Text>
        <Link href="/(auth)/signup" asChild>
          <Pressable>
            <Text className="auth-link">Create an account</Text>
          </Pressable>
        </Link>
      </View>
    </AuthShell>
  );
}
