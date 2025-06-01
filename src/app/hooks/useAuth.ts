"use client";

import { useState, useEffect } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../lib/firebase";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if we're already on the login page to prevent redirect loops
    const isLoginPage = window.location.pathname === "/login";

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setLoading(false);

      if (!user && !isLoginPage) {
        // If no Firebase user and not on login page, clear session and redirect
        try {
          await fetch("/api/auth/logout", { method: "POST" });
        } catch (error) {
          console.error("Failed to clear session:", error);
        }
        window.location.href = "/login";
      }
    });

    return () => unsubscribe();
  }, []);

  return { user, loading };
}
