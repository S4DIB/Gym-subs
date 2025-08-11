import { User } from "firebase/auth";

// Admin email addresses - you can modify this list
const ADMIN_EMAILS = [
  "shahsadib25@gmail.com",
  "admin@fitlife.com",
];

export function isAdmin(user: User | null): boolean {
  if (!user?.email) return false;
  return ADMIN_EMAILS.includes(user.email.toLowerCase());
}

export function requireAdmin(user: User | null): void {
  if (!isAdmin(user)) {
    throw new Error("Admin access required");
  }
}
