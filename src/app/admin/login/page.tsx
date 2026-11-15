import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/admin/LoginForm";
import { isAdminConfigured } from "@/lib/admin-auth";

export const metadata: Metadata = { title: "Log in" };

export default function AdminLoginPage({ searchParams }: PageProps<"/admin/login">) {
  const configured = isAdminConfigured();
  return (
    <div className="mx-auto max-w-sm">
      <div className="card p-8">
        <h1 className="font-display text-3xl text-forest">Staff login</h1>
        {!configured ? (
          <p className="mt-3 rounded-xl bg-terracotta-100 p-3 text-sm text-terracotta">
            ADMIN_PASSWORD is not set (or is shorter than 8 characters). Add it to the environment to enable the admin area.
          </p>
        ) : null}
        <Suspense fallback={null}>
          <LoginFormWithNext searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}

async function LoginFormWithNext({ searchParams }: Pick<PageProps<"/admin/login">, "searchParams">) {
  const sp = await searchParams;
  const next = typeof sp.next === "string" ? sp.next : "/admin";
  return <LoginForm next={next} />;
}
