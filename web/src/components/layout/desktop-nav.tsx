"use client";
// Client component because dropdowns need interactivity

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, User } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * Navigation items configuration
 *
 * Defining nav items as data makes it easy to:
 * 1. Add/remove/reorder items
 * 2. Generate both desktop and mobile navs from same source
 * 3. Keep things consistent
 *
 * In Angular, you might put this in a service or constant.
 */
const navItems = [
  {
    label: "Inventory",
    href: "/gallery",
    children: [
      { label: "Current Inventory", href: "/gallery" },
      { label: "Sold Vehicles", href: "/sold" },
    ],
  },
  { label: "Service", href: "/service" },
  { label: "Car Storage", href: "/storage" },
  { label: "Finance", href: "/finance" },
  { label: "Contact", href: "/contact" },
];

interface DesktopNavProps {
  isAdmin: boolean;
}

/**
 * DesktopNav - Navigation for larger screens
 *
 * Props in React:
 * - Like @Input() in Angular
 * - Like props in Qwik
 * - Data passed from parent to child component
 *
 * { isAdmin }: This is "destructuring" - extracts isAdmin from props object
 */
export function DesktopNav({ isAdmin }: DesktopNavProps) {
  // usePathname hook: Returns current URL path
  // Used to highlight the active nav item
  // Similar to Angular's Router.url or Qwik's useLocation()
  const pathname = usePathname();

  return (
    <nav className="flex items-center space-x-1">
      {/*
        .map() - JavaScript array method to transform each item
        Like *ngFor in Angular or .map() in Qwik

        We loop through navItems and render either:
        - A dropdown (if item has children)
        - A simple link (if no children)
      */}
      {navItems.map((item) =>
        item.children ? (
          // Dropdown for items with children (like Inventory)
          <DropdownMenu key={item.label}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "flex items-center gap-1 text-sm font-medium",
                  // Highlight if current path starts with this item's href
                  pathname.startsWith(item.href) && "text-primary"
                )}
              >
                {item.label}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {item.children.map((child) => (
                <DropdownMenuItem key={child.href} asChild>
                  <Link
                    href={child.href}
                    className={cn(
                      pathname === child.href && "bg-accent"
                    )}
                  >
                    {child.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          // Simple link for items without children
          <Button
            key={item.label}
            variant="ghost"
            asChild
            className={cn(
              "text-sm font-medium",
              pathname === item.href && "text-primary"
            )}
          >
            <Link href={item.href}>{item.label}</Link>
          </Button>
        )
      )}

      {/*
        Admin link - only rendered if isAdmin is true

        In JSX, we use && for conditional rendering:
        {condition && <Component />}

        If condition is true, renders the component.
        If false, renders nothing.

        Like *ngIf in Angular or the conditional operator in Qwik.
      */}
      {isAdmin && (
        <Button
          variant="ghost"
          asChild
          className={cn(
            "text-sm font-medium",
            pathname.startsWith("/admin") && "text-primary"
          )}
        >
          <Link href="/admin" className="flex items-center gap-1">
            <User className="h-4 w-4" />
            Admin
          </Link>
        </Button>
      )}
    </nav>
  );
}
