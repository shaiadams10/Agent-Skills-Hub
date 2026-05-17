import Image from "next/image";
import Link from "next/link";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { SystemModuleCard } from "@/components/SystemModuleCard";

export default function HomePage() {
  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-16 p-6 md:p-16">
      <section className="relative grid grid-cols-1 items-center gap-8 overflow-hidden border-[3px] border-on-background bg-surface-container-high p-8 shadow-brutal-lg md:grid-cols-2 md:p-12">
        <div className="relative z-10 flex flex-col gap-6">
          <div className="inline-flex w-max border-2 border-on-background bg-secondary-container px-3 py-1">
            <span className="text-xs font-bold uppercase tracking-wider text-on-secondary-container">
              v0.1 Local Hub
            </span>
          </div>
          <h2 className="text-4xl font-bold leading-none text-on-background md:text-5xl lg:text-[3rem]">
            Your coding agents,
            <br />
            <span className="mt-2 inline-block border-[3px] border-on-background bg-primary-container px-2 py-1 text-primary shadow-brutal">
              One dashboard.
            </span>
          </h2>
          <p className="max-w-md text-lg text-on-surface-variant">
            Manage skills installed for Cursor, Claude Code, Copilot, Antigravity, and more — all paths in
            one place. Runs only on localhost.
          </p>
          <div className="mt-4 flex flex-wrap gap-4">
            <Link
              href="/installed"
              className="border-[3px] border-on-background bg-primary px-6 py-3 text-sm font-bold uppercase text-on-primary shadow-brutal transition-all hover:bg-primary-container hover:text-on-primary-container active:translate-x-1 active:translate-y-1 active:shadow-none"
            >
              View my installed skills
            </Link>
            <Link
              href="/setup"
              className="flex items-center gap-2 border-[3px] border-on-background bg-surface-container-lowest px-6 py-3 text-sm font-bold uppercase shadow-brutal transition-all hover:bg-surface-variant active:translate-x-1 active:translate-y-1 active:shadow-none"
            >
              First-time setup
              <MaterialIcon name="arrow_forward" className="!text-[18px]" />
            </Link>
          </div>
        </div>
        <figure className="relative mx-auto w-full max-w-xl border-[3px] border-on-background bg-surface-container-lowest shadow-brutal md:max-w-none">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-[10px] border-2 border-dashed border-outline"
          />
          <div className="relative aspect-[3/2] w-full">
            <Image
              src="/images/hero-local-skills-scan.png"
              alt="Pixel-art illustration: laptop scanning local folders into SKILL.md files, with a shield for privacy and no cloud uploads."
              fill
              className="object-contain object-center p-4 sm:p-6"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
        </figure>
      </section>

      <section className="flex flex-col gap-8">
        <div className="flex items-end justify-between border-b-[3px] border-on-background pb-4">
          <h3 className="text-3xl font-bold uppercase tracking-tight text-on-background md:text-4xl">
            System modules
          </h3>
        </div>
        <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-3">
          <SystemModuleCard
            title="Project skills"
            headerClassName="bg-primary-fixed"
            titleClassName="text-on-primary-fixed"
            icon="workspaces"
            summary="List every SKILL.md in repos you watch — Cursor, Codex, Claude, Copilot paths, and shared `.agents/skills`."
            detail="Add a project folder, sync once, and get one card per skill with description, disk path, which tools can use it, and how it was installed."
            tags={["per-repo", "SKILL.md scan"]}
          />
          <SystemModuleCard
            title="Global skills"
            titleClassName="text-on-secondary-container"
            headerClassName="bg-secondary-container"
            icon="travel_explore"
            summary="Skills living in your home folder (e.g. `~/.cursor/skills`, `~/.codex/skills`) — available to every project on this PC."
            detail="No repo to add. One scan reads vendor-documented global directories on localhost only; files never leave your machine."
            tags={["system-wide", "localhost"]}
          />
          <SystemModuleCard
            title="Manage"
            headerClassName="bg-tertiary-fixed"
            titleClassName="text-on-tertiary-fixed"
            icon="tune"
            summary="Re-scan after installs, delete skill folders from safe roots only, and show badges for the tools you pick in Setup."
            detail="Sync skills refreshes the list. Delete removes the skill folder only when it sits under a known skills directory. Setup filters which agent icons appear on each card."
            tags={["sync", "delete-safe"]}
          />
        </div>
      </section>

      <section className="flex flex-col items-start gap-8 border-[3px] border-on-background bg-surface-container p-8 shadow-brutal-lg md:flex-row">
        <div className="top-28 flex shrink-0 flex-col gap-4 md:sticky md:w-1/3">
          <h3 className="text-3xl font-bold uppercase tracking-tight md:text-4xl">Quick start</h3>
          <p className="text-lg text-on-surface-variant">
            Double-click the launcher, pick your assistants, sync skills.
          </p>
        </div>
        <div className="flex w-full flex-col gap-6 md:w-2/3">
          <div className="flex items-start gap-6 border-[3px] border-on-background bg-surface-container-lowest p-6 shadow-brutal">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center border-[3px] border-on-background bg-primary text-lg font-bold text-on-primary shadow-brutal-sm">
              1
            </div>
            <div className="flex flex-col gap-2 pt-1">
              <h4 className="text-xl font-bold">Launch Hub</h4>
              <p className="text-on-surface-variant">
                Ask your AI agent to install from GitHub using INSTALL.md, or run Start Agent Skills Hub (.bat / .command).
              </p>
            </div>
          </div>
          <div className="flex items-start gap-6 border-[3px] border-on-background bg-surface-container-lowest p-6 shadow-brutal">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center border-[3px] border-on-background bg-primary text-lg font-bold text-on-primary shadow-brutal-sm">
              2
            </div>
            <div className="flex flex-col gap-2 pt-1">
              <h4 className="text-xl font-bold">Choose tools</h4>
              <p className="text-on-surface-variant">Open Setup so we remember which assistants you use.</p>
            </div>
          </div>
          <div className="flex items-start gap-6 border-[3px] border-on-background bg-surface-container-lowest p-6 shadow-brutal">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center border-[3px] border-on-background bg-primary text-lg font-bold text-on-primary shadow-brutal-sm">
              3
            </div>
            <div className="flex flex-col gap-2 pt-1">
              <h4 className="text-xl font-bold">Sync skills</h4>
              <p className="text-on-surface-variant">
                Browse global + project SKILL.md installs and open folders from the UI.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
