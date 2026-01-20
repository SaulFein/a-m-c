/**
 * Layout Components - Barrel Export
 *
 * This file re-exports all layout components from a single location.
 * It's called a "barrel file" or "index export".
 *
 * Benefits:
 * 1. Cleaner imports in other files:
 *    - Instead of: import { Header } from "@/components/layout/header"
 *    - You can do: import { Header } from "@/components/layout"
 *
 * 2. Encapsulation:
 *    - You control what's "public" from this folder
 *    - Internal helpers can stay private
 *
 * In Angular, this is similar to the public-api.ts file in libraries.
 */

export { Header } from "./header";
export { Footer } from "./footer";
export { DesktopNav } from "./desktop-nav";
export { MobileNav } from "./mobile-nav";
