"use client";

import { useRef } from "react";
import { LogOut } from "lucide-react";

import { signOutAction } from "@/app/actions/auth";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

export function SignOutMenuItem() {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <>
      <form ref={formRef} action={signOutAction} className="hidden" />
      <DropdownMenuItem
        onSelect={(event) => {
          event.preventDefault();
          formRef.current?.requestSubmit();
        }}
      >
        <LogOut className="h-4 w-4" />
        Sign out
      </DropdownMenuItem>
    </>
  );
}
