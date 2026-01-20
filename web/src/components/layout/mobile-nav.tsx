"use client";
// Client component - needs state for open/close

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, User, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

/**
 * Same nav items as desktop - we could extract this to a shared file
 * to avoid duplication (DRY principle). For now, keeping it simple.
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

interface MobileNavProps {
  isAdmin: boolean;
}

export function MobileNav({ isAdmin }: MobileNavProps) {
  // useState hook: Creates local component state
  // Returns [currentValue, setterFunction]
  //
  // In Angular, you'd use a class property and change detection.
  // In Qwik, you'd use useSignal().
  // In React, useState triggers a re-render when value changes.
  const [open, setOpen] = React.useState(false);

  const pathname = usePathname();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {/*
        Sheet: A slide-out panel component (from shadcn/ui)
        - open: controlled state (is it open?)
        - onOpenChange: callback when state should change

        "Controlled components" in React:
        - Parent controls the state
        - Child calls parent's callback to request changes
        - Like [(ngModel)] in Angular, but explicit
      */}

      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="ml-2">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open menu</span>
          {/*
            sr-only: Screen reader only
            Hidden visually but readable by screen readers
            Important for accessibility!
          */}
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-[300px] sm:w-[350px]">
        {/*
          SheetContent: The actual slide-out panel
          side="right": Slides in from right
          Responsive width with sm: breakpoint
        */}

        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>

        <nav className="mt-8 flex flex-col space-y-1">
          {navItems.map((item) => (
            <div key={item.label}>
              {item.children ? (
                // Items with children: show as section with sub-items
                <div className="space-y-1">
                  <div className="px-3 py-2 text-sm font-semibold text-muted-foreground">
                    {item.label}
                  </div>
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center rounded-md px-3 py-2 text-sm hover:bg-accent",
                        pathname === child.href && "bg-accent text-accent-foreground"
                      )}
                    >
                      <ChevronRight className="mr-2 h-4 w-4" />
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : (
                // Simple items: just a link
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  /*
                    onClick={() => setOpen(false)}

                    Close the menu when a link is clicked.
                    This improves UX - user doesn't have to manually close.

                    In your old jQuery code, you did this with:
                    $('.navbar-collapse').collapse('toggle');
                  */
                  className={cn(
                    "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent",
                    pathname === item.href && "bg-accent text-accent-foreground"
                  )}
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}

          {/* Admin link */}
          {isAdmin && (
            <>
              <div className="my-2 border-t" />
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent",
                  pathname.startsWith("/admin") && "bg-accent text-accent-foreground"
                )}
              >
                <User className="mr-2 h-4 w-4" />
                Admin Dashboard
              </Link>
            </>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
