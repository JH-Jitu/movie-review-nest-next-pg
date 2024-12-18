"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SubmitButton from "@/components/ui/submitButton";
import { useLogin } from "@/hooks/api/use-auth";
import { signIn } from "@/lib/auth";
import { LoginFormSchema } from "@/lib/type";
import Link from "next/link";
import React from "react";
import { useFormState } from "react-dom";

interface FormState {
  error?: {
    email?: string[];
    password?: string[];
  };
  message?: string;
}
const SignInForm = () => {
  // const [state, action] = useFormState(signIn, undefined); // Note: here "signIn" function is from my old implementation - which is without React-Query/Zustand etc
  const loginMutation = useLogin();

  const [state, action] = useFormState(newSignIn, {
    error: {},
    message: undefined, // Default initial state
  });

  async function newSignIn(
    state: FormState,
    formData: FormData
  ): Promise<FormState> {
    const parsed = LoginFormSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    // Handle validation errors
    if (!parsed.success) {
      return {
        error: parsed.error.flatten().fieldErrors,
        message: undefined,
      };
    }

    // Attempt login
    try {
      await loginMutation.mutateAsync(parsed.data);
      return {
        error: {},
        message: undefined, // Reset error on success
      };
    } catch (error) {
      console.log({ "error from signinform": error });
      return {
        error: {},
        message: "Invalid Credentials!", // Handle mutation error
      };
    }
  }

  return (
    <form action={action}>
      <div className="flex flex-col gap-2 w-64">
        {state?.message && (
          <p className="text-sm text-red-500">{state.message}</p>
        )}
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            placeholder="m@example.com"
            type="email"
          />
        </div>
        {state?.error?.email && (
          <p className="text-sm text-red-500">{state.error.email}</p>
        )}

        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" name="password" />
        </div>
        {state?.error?.password && (
          <p className="text-sm text-red-500">{state.error.password}</p>
        )}
        <Link className="text-sm underline" href="#">
          Forgot your password?
        </Link>

        <SubmitButton>Sign In</SubmitButton>
        <div className="flex justify-between text-sm">
          <p> Don't have an account? </p>
          <Link className="text-sm underline" href="/auth/signup">
            Sign Up
          </Link>
        </div>
      </div>
    </form>
  );
};

export default SignInForm;
