import { useSignUp } from "@clerk/expo/legacy";
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

const minimumPasswordLength = 8;

export default function SignUp() {
  const { signUp, setActive, isLoaded } = useSignUp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [errors, setErrors] = useState<AuthFieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);

  async function handleCreateAccount() {
    const nextErrors: AuthFieldErrors = {};
    const emailAddress = normalizeEmail(email);

    if (!isValidEmail(emailAddress)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (password.length < minimumPasswordLength) {
      nextErrors.password = `Use at least ${minimumPasswordLength} characters.`;
    }

    setErrors(nextErrors);

    if (nextErrors.email || nextErrors.password || !isLoaded) {
      return;
    }

    setSubmitting(true);

    try {
      await signUp.create({
        emailAddress,
        password,
      });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
      setErrors({});
    } catch (error) {
      setErrors(getClerkFieldErrors(error));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleVerifyEmail() {
    const verificationCode = code.trim();

    if (!verificationCode) {
      setErrors({ code: "Enter the code from your email." });
      return;
    }

    if (!isLoaded) {
      return;
    }

    setSubmitting(true);

    try {
      const result = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        return;
      }

      setErrors({
        form: "We could not finish creating your account. Please try the code again.",
      });
    } catch (error) {
      setErrors(getClerkFieldErrors(error));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResendCode() {
    if (!isLoaded) {
      return;
    }

    setResending(true);

    try {
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setErrors({});
    } catch (error) {
      setErrors(getClerkFieldErrors(error));
    } finally {
      setResending(false);
    }
  }

  function handleStartOver() {
    setPendingVerification(false);
    setCode("");
    setErrors({});
  }

  if (pendingVerification) {
    return (
      <AuthShell
        title="Check your email"
        subtitle={`Enter the verification code sent to ${normalizeEmail(email)}`}
      >
        <View className="auth-form">
          <AuthTextInput
            error={errors.code}
            inputMode="numeric"
            keyboardType="number-pad"
            label="Verification code"
            maxLength={8}
            onChangeText={(value) => {
              setCode(value);
              setErrors((current) => ({ ...current, code: undefined, form: undefined }));
            }}
            onSubmitEditing={handleVerifyEmail}
            placeholder="Enter your code"
            returnKeyType="done"
            textContentType="oneTimeCode"
            value={code}
          />

          {errors.form ? <Text className="auth-error">{errors.form}</Text> : null}

          <AuthButton
            disabled={!code.trim() || !isLoaded}
            loading={submitting}
            onPress={handleVerifyEmail}
          >
            Verify email
          </AuthButton>

          <AuthButton
            disabled={resending || submitting}
            loading={resending}
            onPress={handleResendCode}
            variant="secondary"
          >
            Send a new code
          </AuthButton>

          <Pressable className="items-center py-2" onPress={handleStartOver}>
            <Text className="auth-link">Use a different email</Text>
          </Pressable>
        </View>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Track renewals, payment methods, and billing dates in one calm place"
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
          placeholder="Create a password"
          value={password}
          visible={passwordVisible}
        />

        <Text className="auth-helper">
          Use at least {minimumPasswordLength} characters for a safer account.
        </Text>

        <View nativeID="clerk-captcha" />

        {errors.form ? <Text className="auth-error">{errors.form}</Text> : null}

        <AuthButton
          disabled={!email || password.length < minimumPasswordLength || !isLoaded}
          loading={submitting}
          onPress={handleCreateAccount}
        >
          Create account
        </AuthButton>
      </View>

      <View className="auth-link-row">
        <Text className="auth-link-copy">Already managing subscriptions?</Text>
        <Link href="/(auth)/signin" asChild>
          <Pressable>
            <Text className="auth-link">Sign in</Text>
          </Pressable>
        </Link>
      </View>
    </AuthShell>
  );
}
