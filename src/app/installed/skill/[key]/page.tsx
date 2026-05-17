import Link from "next/link";
import { notFound } from "next/navigation";
import { AgentBadgeList } from "@/components/AgentIcon";
import { SkillDetailDeleteButton } from "@/components/SkillDetailActions";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { loadSettings } from "@/lib/settings/store";
import { readSkillDetail } from "@/lib/skills/read-skill-detail";
import { decodeSkillPathKey } from "@/lib/skills/skill-path-key";
import { InstallOriginBadge } from "@/components/InstallOriginBadge";

const SKILL_ICONS = [
  "auto_awesome",
  "psychology",
  "terminal",
  "code_blocks",
  "language",
  "memory",
] as const;

function iconForSkill(name: string): string {
  let h = 0;
  for (const c of name) h = (h + c.charCodeAt(0)) % SKILL_ICONS.length;
  return SKILL_ICONS[h]!;
}

type PageProps = { params: Promise<{ key: string }> };

export default async function SkillDetailPage(props: PageProps) {
  const { key } = await props.params;
  let decoded: string;
  try {
    decoded = decodeSkillPathKey(key);
  } catch {
    notFound();
  }

  const settings = await loadSettings();

  let detail: Awaited<ReturnType<typeof readSkillDetail>>;
  try {
    detail = await readSkillDetail(decoded);
  } catch {
    notFound();
  }

  const icon = iconForSkill(detail.parsed.name);
  const locationLabel = detail.scope === "global" ? "Global" : detail.rootLabel;

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-10 md:px-8 lg:py-14">
      <Link
        href="/installed"
        className="group inline-flex w-fit items-center gap-2 py-2 text-sm font-bold uppercase tracking-tight text-on-background transition-colors hover:text-primary"
      >
        <MaterialIcon
          name="arrow_back"
          className="transition-transform group-hover:-translate-x-1"
        />
        Back to installed
      </Link>

      <section className="relative flex flex-col items-start gap-8 overflow-hidden border-[3px] border-on-background bg-surface-container-lowest p-6 shadow-brutal-lg md:flex-row md:p-8">
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full border-[3px] border-on-background opacity-10" />
        <div className="pointer-events-none absolute right-24 top-10 h-10 w-10 bg-primary opacity-10" />
        <div className="flex h-28 w-28 shrink-0 items-center justify-center border-[3px] border-on-background bg-surface-dim shadow-brutal">
          <MaterialIcon name={icon} fill className="!text-5xl text-primary" />
        </div>
        <div className="flex flex-grow flex-col gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center border-2 border-on-background bg-secondary-container px-2 py-1 text-xs font-bold uppercase tracking-tight">
              Location: {locationLabel}
            </span>
            <InstallOriginBadge origin={detail.installOrigin} />
            {detail.parsed.valid ? (
              <span className="inline-flex items-center gap-1 border-2 border-on-background bg-surface-dim px-2 py-1 text-xs font-bold uppercase tracking-tight">
                <MaterialIcon name="verified" className="!text-base" /> Valid
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 border-2 border-on-background bg-error-container px-2 py-1 text-xs font-bold uppercase tracking-tight">
                Needs attention
              </span>
            )}
          </div>
          <p className="max-w-3xl text-xs text-on-surface-variant">{detail.installOrigin.detail}</p>
          <h1 className="text-4xl font-bold uppercase leading-none tracking-tight text-on-background md:text-5xl">
            {detail.parsed.name}
          </h1>
          <p className="max-w-3xl text-lg text-on-surface-variant">{detail.parsed.description}</p>
          {detail.parsed.compatibility && (
            <p className="text-sm text-on-surface-variant">
              <span className="font-bold uppercase">Compatibility:</span>{" "}
              {detail.parsed.compatibility}
            </p>
          )}
          {detail.parsed.issues.length > 0 && (
            <ul className="list-inside text-sm font-bold uppercase text-error">
              {detail.parsed.issues.map((issue) => (
                <li key={issue}>{issue}</li>
              ))}
            </ul>
          )}

          {detail.gitUpdateStatus.state === "update_available" && (
            <div className="skill-update-available border-[3px] border-secondary bg-secondary-fixed/25 p-4 text-sm">
              <p className="flex items-center gap-2 font-bold uppercase text-secondary">
                <MaterialIcon name="upgrade" />
                Update available (git)
              </p>
              <p className="mt-2 font-mono text-xs text-on-surface-variant">
                Branch {detail.gitUpdateStatus.branch}: local{" "}
                <span className="text-on-background">{detail.gitUpdateStatus.localSha.slice(0, 7)}</span> → origin{" "}
                <span className="text-on-background">{detail.gitUpdateStatus.remoteSha.slice(0, 7)}</span>
              </p>
              <p className="mt-2 text-on-surface-variant">
                Run <code className="border border-outline px-1 font-mono text-xs">git pull</code> in the skill folder,
                or sync however you manage that repo.
              </p>
            </div>
          )}
          {detail.gitUpdateStatus.state === "git_error" && (
            <p className="border-2 border-outline bg-surface-dim p-3 text-xs font-mono text-on-surface-variant">
              Git check: {detail.gitUpdateStatus.message}
            </p>
          )}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="flex flex-col gap-8 lg:col-span-8">
          <article className="border-[3px] border-on-background bg-surface-container-lowest shadow-brutal">
            <div className="flex items-center gap-2 border-b-[3px] border-on-background bg-surface-container p-4">
              <MaterialIcon name="description" />
              <h2 className="text-xl font-bold uppercase tracking-tight">SKILL.md</h2>
            </div>
            <div className="flex flex-col gap-4 p-6 md:p-8">
              <div className="whitespace-pre-wrap border-2 border-on-background bg-surface-dim p-4 font-mono text-sm text-on-background">
                {detail.markdownBody}
              </div>
            </div>
          </article>
        </div>

        <div className="flex flex-col gap-8 lg:col-span-4">
          <div className="border-[3px] border-on-background bg-surface-container-lowest shadow-brutal">
            <div className="border-b-[3px] border-on-background bg-surface-container p-4">
              <h3 className="text-lg font-bold uppercase tracking-tight">Works with</h3>
            </div>
            <div className="p-6">
              {detail.compatibleAgentIds.length > 0 ? (
                <AgentBadgeList
                  agentIds={detail.compatibleAgentIds}
                  enabledAgentIds={settings.enabledAgentIds}
                />
              ) : (
                <p className="text-sm text-on-surface-variant">
                  No tool paths matched this location. Check{" "}
                  <Link href="/setup" className="font-bold uppercase text-primary underline">
                    Setup
                  </Link>{" "}
                  and rescan from Installed.
                </p>
              )}
            </div>
          </div>

          <div className="border-[3px] border-on-background bg-surface-container-lowest shadow-brutal">
            <div className="border-b-[3px] border-on-background bg-surface-container p-4">
              <h3 className="text-lg font-bold uppercase tracking-tight">Paths</h3>
            </div>
            <div className="flex flex-col gap-4 p-6">
              <div className="relative mt-2">
                <div className="absolute -top-3 left-4 border-l-[3px] border-r-[3px] border-on-background bg-surface-container-lowest px-2 text-xs font-bold uppercase">
                  Skill folder
                </div>
                <div className="border-[3px] border-on-background bg-surface-dim p-4 pt-6">
                  <code className="break-all font-mono text-xs text-on-background">{detail.skillPath}</code>
                </div>
              </div>
              <div className="relative mt-2">
                <div className="absolute -top-3 left-4 border-l-[3px] border-r-[3px] border-on-background bg-surface-container-lowest px-2 text-xs font-bold uppercase">
                  SKILL.md
                </div>
                <div className="border-[3px] border-on-background bg-surface-dim p-4 pt-6">
                  <code className="break-all font-mono text-xs text-on-background">{detail.skillMdPath}</code>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <SkillDetailDeleteButton skillPath={detail.skillPath} skillName={detail.parsed.name} />
          </div>
        </div>
      </div>
    </div>
  );
}
