"use client";

import React, { useState, useEffect } from "react";
import { Switch } from "@nextui-org/react";
import { useTheme } from "next-themes";

export default function ToggleSwitch() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [count, setCount] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Switch
      defaultSelected
      aria-label="Automatic updates"
      onClick={
        theme === "light" ? () => setTheme("dark") : () => setTheme("light")
      }
    />
  );
}
