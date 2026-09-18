"use client";

import { useEffect } from "react";

export default function PwaRegister() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((reg) => {
            console.log("KrishiBuddy PWA Service Worker active with scope:", reg.scope);
          })
          .catch((err) => {
            console.warn("PWA Service worker registration error:", err);
          });
      });
    }
  }, []);

  return null;
}
