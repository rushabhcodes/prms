"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";

import { loginAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toaster";
import { loginSchema, type LoginValues } from "@/lib/validations/auth";

export function LoginForm({ isDemo }: { isDemo: boolean }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: isDemo ? "admin@prms.local" : "",
      password: isDemo ? "password123" : "",
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      const result = await loginAction(values);

      toast({
        title: result.success ? "Access granted" : "Sign-in failed",
        description: result.message,
        variant: result.success ? "success" : "destructive",
      });

      if (result.success) {
        router.push("/dashboard");
        router.refresh();
      }
    });
  });

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.1fr_0.9fr]">
      <section className="hidden bg-slate-950 px-10 py-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">
            Unified Records Control
          </p>
          <h1 className="font-heading text-5xl font-semibold leading-tight">
            Build trust with faster case visibility and cleaner audit trails.
          </h1>
          <p className="max-w-xl text-base text-slate-300">
            PRMS gives admins, officers, and viewers a secure dashboard for FIR intake,
            criminal record approvals, case follow-ups, and user access control.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["Role-aware access", "Admin, officer, and viewer flows stay sharply separated."],
            ["Approvals at a glance", "Pending records and high-priority cases surface instantly."],
            ["Audit-ready by default", "Every operational change is designed for accountability."],
          ].map(([title, description]) => (
            <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="font-medium">{title}</p>
              <p className="mt-2 text-sm text-slate-300">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="flex items-center justify-center px-4 py-10 sm:px-8">
        <Card className="w-full max-w-lg">
          <CardHeader className="space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--primary)]/12">
              <ShieldCheck className="h-6 w-6 text-[color:var(--primary)]" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-3xl">Sign in to PRMS</CardTitle>
              <CardDescription>
                Use your Supabase credentials to access the police records dashboard.
                {isDemo
                  ? " Demo accounts are prefilled so you can preview the full flow immediately."
                  : ""}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form className="space-y-5" onSubmit={onSubmit}>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="officer@department.gov" {...form.register("email")} />
                {form.formState.errors.email ? (
                  <p className="text-sm text-rose-600">{form.formState.errors.email.message}</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="Enter your password" {...form.register("password")} />
                {form.formState.errors.password ? (
                  <p className="text-sm text-rose-600">{form.formState.errors.password.message}</p>
                ) : null}
              </div>

              {isDemo ? (
                <div className="rounded-2xl border border-dashed border-[color:var(--border)] bg-[color:var(--secondary)]/60 p-4 text-sm text-[color:var(--muted-foreground)]">
                  <p className="font-medium text-slate-950">Demo accounts</p>
                  <p className="mt-1">`admin@prms.local`, `officer@prms.local`, or `viewer@prms.local`</p>
                  <p>Password: `password123`</p>
                </div>
              ) : null}

              <Button className="w-full" size="lg" type="submit" disabled={isPending}>
                {isPending ? "Signing in..." : "Continue to dashboard"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
