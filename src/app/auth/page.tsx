"use client";

import { useCallback, useState } from "react";
import { useForm, FieldValues, SubmitHandler } from "react-hook-form";
import { Button, Input } from "@heroui/react";
import axios from "axios";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

type Variant = "LOGIN" | "REGISTER";

export default function AuthPage() {
  const router = useRouter(); // <-- Tambahkan baris ini
  const [variant, setVariant] = useState<Variant>("LOGIN");
  const [isLoading, setIsLoading] = useState(false);

  const toggleVariant = useCallback(() => {
    setVariant((prev) => (prev === "LOGIN" ? "REGISTER" : "LOGIN"));
  }, []);

  const { register, handleSubmit } = useForm<FieldValues>({
    defaultValues: { name: "", email: "", password: "" },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    if (variant === "REGISTER") {
      axios
        .post("/api/register", data)
        .then(() => signIn("credentials", data))
        .catch((error) => {
          if (error instanceof Error) {
            console.error("Registration failed:", error.message);
          } else {
            console.error("An unexpected registration error occurred:", error);
          }
        })
        .finally(() => setIsLoading(false));
    }

    if (variant === "LOGIN") {
      signIn("credentials", { ...data, redirect: false })
        .then((callback) => {
          if (callback?.error) {
            console.error("Invalid credentials");
          }
          if (callback?.ok && !callback?.error) {
            router.push("/dashboard");
          }
        })
        .finally(() => setIsLoading(false));
    }
  };

  const socialAction = (action: string) => {
    setIsLoading(true);
    signIn(action, {
      callbackUrl: "/dashboard",
    }).catch((error) => {
      console.error("Social login failed", error);
      setIsLoading(false);
    });
  };

  return (
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          {variant === "LOGIN"
            ? "Sign in to your account"
            : "Register for an account"}
        </h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-blue-50 px-4 py-8 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {variant === "REGISTER" && (
              <Input
                isRequired
                className="text-gray-500 hover:text-gray-700"
                {...register("name", { required: true })}
                placeholder="Name"
                disabled={isLoading}
                variant="bordered"
              />
            )}
            <Input
              isRequired
              className="text-gray-500 hover:text-gray-700"
              {...register("email", { required: true })}
              placeholder="Email address"
              type="email"
              disabled={isLoading}
              variant="bordered"
            />
            <Input
              isRequired
              className="text-gray-500 hover:text-gray-700"
              {...register("password", { required: true })}
              placeholder="Password"
              type="password"
              disabled={isLoading}
              variant="bordered"
            />
            <div>
              <Button
                type="submit"
                color="primary"
                disabled={isLoading}
                fullWidth
              >
                {variant === "LOGIN" ? "Sign in" : "Register"}
              </Button>
            </div>
          </form>
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-blue-50 px-2 text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>
            <div className="mt-6">
              <Button
                className="text-gray-500 hover:text-gray-700"
                fullWidth
                onClick={() => socialAction("google")}
              >
                Google
              </Button>
            </div>
          </div>
          <div className="flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500">
            <div>
              {variant === "LOGIN"
                ? "New to Curug Hunter?"
                : "Already have an account?"}
            </div>
            <div onClick={toggleVariant} className="underline cursor-pointer">
              {variant === "LOGIN" ? "Create an account" : "Login"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
