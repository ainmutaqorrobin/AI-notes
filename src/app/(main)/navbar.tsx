import logo from "@/assets/logo.png";
import { ModeToggle } from "@/components/mode-toggle";
import Image from "next/image";
import Link from "next/link";
import { SignOutButton } from "./sign-out-button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/75 backdrop-blur-xl">
      <nav className="page-container flex min-h-18 items-center justify-between gap-4 py-3">
        <div className="flex min-w-0 items-center gap-4">
          <Link
            href="/notes"
            className="flex min-w-0 items-center gap-3 transition-opacity hover:opacity-85"
          >
            <div className="surface-soft rounded-2xl border border-border/70 p-2">
              <Image
                src={logo}
                alt="AI Notes logo"
                width={22}
                height={22}
                className="opacity-70"
              />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold tracking-[0.14em] uppercase">
                AI Notes
              </p>
              <p className="truncate text-xs text-muted-foreground">
                Knowledge workspace with grounded AI recall
              </p>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <ModeToggle />
          <SignOutButton />
        </div>
      </nav>
    </header>
  );
}
