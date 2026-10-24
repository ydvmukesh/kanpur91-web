"use client";

import { useEffect } from "react";
import { bootPwa } from "@/lib/pwa/install";

export function PwaBoot() {
  useEffect(() => {
    bootPwa();
  }, []);
  return null;
}
