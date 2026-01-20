"use client";
// ☝️ Client component because we need:
// 1. useTheme hook (React state)
// 2. onClick interactivity

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * ThemeToggle - A dropdown button to switch between light/dark/system themes.
 *
 * React Hooks Explained (for Angular devs):
 * -----------------------------------------
 * Hooks are functions that let you "hook into" React features.
 *
 * - useState: Like a component property that triggers re-render when changed
 *   (Similar to Angular's change detection, but explicit)
 *
 * - useTheme: Custom hook from next-themes that returns:
 *   - theme: current theme ("light", "dark", or "system")
 *   - setTheme: function to change theme (like a setter)
 *
 * In Angular, you'd inject a ThemeService.
 * In Qwik, you'd use useContext to get a signal.
 * In React, hooks provide this functionality.
 */
export function ThemeToggle() {
  // Destructuring: pull out just what we need from useTheme()
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      {/* The button that triggers the dropdown */}
      <DropdownMenuTrigger asChild>
        {/*
          "asChild" means: don't render a <button> inside a <button>.
          Instead, pass props down to the Button component.
          This is a common pattern in headless UI libraries.
        */}
        <Button variant="ghost" size="icon" className="h-9 w-9">
          {/*
            These icons show/hide based on the current theme.
            The CSS classes handle the visibility:
            - "dark:hidden" = hidden when dark mode
            - "dark:block" = visible when dark mode
          */}
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          {/* Screen reader text for accessibility */}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>

      {/* Dropdown menu content */}
      <DropdownMenuContent align="end">
        {/*
          onClick={() => setTheme("light")}

          This is an arrow function that calls setTheme.
          In Angular template: (click)="setTheme('light')"
          In Qwik: onClick$={() => setTheme('light')}

          Why arrow function? Because we need to pass an argument.
          onClick={setTheme} would pass the click event, not "light".
        */}
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
