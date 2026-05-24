"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { MotionFade } from "@/components/motion/MotionFade";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { AppFooter } from "@/components/layout/AppFooter";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { brutalColorHover, brutalPressSm } from "@/lib/motion/css";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/installed", label: "My installed skills" },
  { href: "/setup", label: "Setup" },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  const navLinks = NAV.map((item) => {
    const active = isActive(item.href);
    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={() => setMobileOpen(false)}
        className={`border-b-[3px] pb-1 text-sm font-bold uppercase tracking-tight ${brutalColorHover} ${
          active
            ? "border-primary text-primary"
            : "border-transparent text-on-surface-variant hover:bg-primary-container hover:text-on-surface"
        } px-2 py-1`}
      >
        {item.label}
      </Link>
    );
  });

  const headerButtons = (
    <div className="flex items-center gap-3">
      <span className="hidden text-sm font-bold uppercase text-on-surface-variant md:inline">
        Local app
      </span>
      <ThemeToggle />
      <Link
        href="/setup"
        aria-label="Settings"
        className={`flex items-center justify-center border-[3px] border-on-background p-2 shadow-brutal-sm hover:bg-primary-container ${brutalPressSm}`}
      >
        <MaterialIcon name="settings" />
      </Link>
      <Link
        href="/installed"
        aria-label="Sync skills"
        className={`flex items-center justify-center border-[3px] border-on-background p-2 shadow-brutal-sm hover:bg-primary-container ${brutalPressSm}`}
      >
        <MaterialIcon name="sync" />
      </Link>
    </div>
  );

  return (
    <div className="flex min-h-screen flex-col bg-background text-on-background">
      <header className="sticky top-0 z-50 flex h-20 w-full items-center justify-between border-b-[3px] border-on-background bg-surface-container-lowest px-6 shadow-brutal">
        <div className="flex min-w-0 flex-1 items-center gap-4 md:gap-8">
          <Link href="/" className="shrink-0">
            <h1 className="truncate text-xl font-bold uppercase tracking-tighter text-on-surface md:text-2xl">
              Agent Skills Hub
            </h1>
          </Link>
          <nav className="hidden items-center gap-6 pt-0.5 md:flex">{navLinks}</nav>
        </div>

        <div className="flex shrink-0 items-center gap-4">
          {headerButtons}

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center border-[3px] border-on-background shadow-brutal-sm md:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <MaterialIcon name={mobileOpen ? "close" : "menu"} />
          </button>
        </div>
      </header>

      <MotionFade show={mobileOpen} mode="sync">
        <button
          type="button"
          className="fixed inset-0 z-40 bg-on-background/30 md:hidden"
          aria-hidden
          onClick={() => setMobileOpen(false)}
        />
      </MotionFade>
      <MotionFade show={mobileOpen} slide className="fixed inset-x-0 top-20 z-50 md:hidden">
        <nav className="flex flex-col gap-4 border-b-[3px] border-on-background bg-surface-container-lowest p-6 shadow-brutal">
          {navLinks}
          <div className="border-t-[3px] border-on-background pt-4">{headerButtons}</div>
        </nav>
      </MotionFade>

      <main className="flex flex-1 flex-col">{children}</main>
      <AppFooter />
    </div>
  );
}
