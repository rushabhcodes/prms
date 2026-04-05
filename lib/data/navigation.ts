import type { NavItem } from "@/lib/types/prms";

export const navigationItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: "layout-dashboard",
    roles: ["admin", "officer", "viewer"],
  },
  {
    title: "FIRs",
    href: "/firs",
    icon: "file-text",
    roles: ["admin", "officer", "viewer"],
  },
  {
    title: "Criminal Records",
    href: "/criminal-records",
    icon: "shield-alert",
    roles: ["admin", "officer", "viewer"],
  },
  {
    title: "Cases",
    href: "/cases",
    icon: "folder-kanban",
    roles: ["admin", "officer", "viewer"],
  },
  {
    title: "Users",
    href: "/users",
    icon: "users",
    roles: ["admin"],
  },
  {
    title: "Audit Logs",
    href: "/audit-logs",
    icon: "history",
    roles: ["admin", "officer"],
  },
];
