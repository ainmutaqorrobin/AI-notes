"use client";

import logo from "@/assets/logo.png";
import { PasswordInput } from "@/components/password-input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthActions } from "@convex-dev/auth/react";
import { LockKeyhole, NotebookText, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { AuthFormValues, signinSchema } from "../schema";

const highlights = [
  "Capture meeting notes, research, and operating context in one place.",
  "Ask AI grounded questions across your notes instead of searching manually.",
  "Keep a calmer, more readable record of decisions as work compounds.",
];

export function SigninForm() {
  const [step, setStep] = useState<"signIn" | "signUp">("signIn");
  const { signIn } = useAuthActions();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: AuthFormValues) {
    setIsLoading(true);
    try {
      await signIn("password", { ...values, flow: step });
      toast.success(
        step === "signIn"
          ? "Signed in successfully"
          : "Account created successfully"
      );
      router.push("/notes");
    } catch (error) {
      console.error(error);
      if (
        error instanceof Error &&
        (error.message.includes("InvalidAccountId") ||
          error.message.includes("InvalidSecret"))
      ) {
        form.setError("root", {
          type: "manual",
          message: "Invalid credentials.",
        });
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="page-shell">
      <div className="page-container py-6 sm:py-8 lg:py-12">
        <div className="surface-card overflow-hidden rounded-[2rem] border">
          <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(420px,0.82fr)]">
            <section className="relative overflow-hidden border-b border-border/70 px-6 py-8 sm:px-8 lg:border-r lg:border-b-0 lg:px-10 lg:py-10">
              <div className="absolute inset-x-10 top-0 h-px editorial-rule" />
              <Link
                href="/"
                className="surface-soft inline-flex items-center gap-3 rounded-full border px-4 py-2 text-sm hover:opacity-90"
              >
                <Image
                  src={logo}
                  alt="AI Notes logo"
                  width={22}
                  height={22}
                  className="opacity-70"
                />
                <span className="font-semibold tracking-[0.14em] uppercase">
                  AI Notes
                </span>
              </Link>

              <div className="mt-10 max-w-xl space-y-6">
                <p className="eyebrow">For professionals who need recall</p>
                <h1 className="text-balance text-4xl leading-[0.95] font-semibold sm:text-5xl">
                  {step === "signIn"
                    ? "Return to your working memory."
                    : "Start building a note system that answers back."}
                </h1>
                <p className="text-balance text-base leading-8 text-muted-foreground sm:text-lg">
                  AI Notes combines calm note capture with grounded AI retrieval
                  so your best thinking stays usable long after the meeting
                  ends.
                </p>
              </div>

              <div className="mt-8 grid gap-4">
                {highlights.map((highlight) => (
                  <div
                    key={highlight}
                    className="surface-soft flex items-start gap-3 rounded-[1.4rem] border p-4"
                  >
                    <div className="rounded-2xl bg-primary/10 p-2 text-primary">
                      <NotebookText className="size-4" />
                    </div>
                    <p className="text-sm leading-7 text-muted-foreground">
                      {highlight}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="px-6 py-8 sm:px-8 lg:px-10 lg:py-10">
              <div className="mx-auto max-w-md">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="eyebrow">
                      {step === "signIn" ? "Secure access" : "Create workspace"}
                    </p>
                    <h2 className="mt-2 text-3xl font-semibold">
                      {step === "signIn" ? "Sign in" : "Create account"}
                    </h2>
                  </div>
                  <div className="surface-soft rounded-full border p-3 text-primary">
                    {step === "signIn" ? (
                      <LockKeyhole className="size-5" />
                    ) : (
                      <Sparkles className="size-5" />
                    )}
                  </div>
                </div>

                <p className="mt-4 text-sm leading-7 text-muted-foreground">
                  {step === "signIn"
                    ? "Use your account credentials to return to your notes and AI workspace."
                    : "Set up your account to start capturing notes and asking grounded questions across them."}
                </p>

                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="mt-8 space-y-5"
                  >
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold">
                            Email
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="you@example.com"
                              {...field}
                              type="email"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold">
                            Password
                          </FormLabel>
                          <FormControl>
                            <PasswordInput placeholder="Password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {form.formState.errors.root && (
                      <div className="rounded-[1rem] border border-destructive/20 bg-destructive/8 px-4 py-3 text-sm text-destructive">
                        {form.formState.errors.root.message}
                      </div>
                    )}

                    <Button className="w-full" disabled={isLoading} size="lg">
                      {isLoading
                        ? step === "signIn"
                          ? "Signing in..."
                          : "Creating account..."
                        : step === "signIn"
                          ? "Enter workspace"
                          : "Create workspace"}
                    </Button>
                  </form>
                </Form>

                <div className="mt-6 surface-soft rounded-[1.35rem] border p-4">
                  <p className="text-sm leading-7 text-muted-foreground">
                    {step === "signIn"
                      ? "New here? Create an account to start building an AI-searchable note archive."
                      : "Already have an account? Sign in to continue where your notes left off."}
                  </p>
                  <Button
                    variant="link"
                    type="button"
                    className="mt-2 h-auto p-0 text-sm"
                    onClick={() => {
                      setStep(step === "signIn" ? "signUp" : "signIn");
                      form.reset();
                    }}
                  >
                    {step === "signIn"
                      ? "Create a new account"
                      : "Return to sign in"}
                  </Button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
