import Link from "next/link";
import path from "path";
import { notFound } from "next/navigation";
import { scanProjectSkills } from "@/lib/scanner/skill-scanner";
import { decodeSkillPathKey } from "@/lib/skills/skill-path-key";
import { loadSettings } from "@/lib/settings/store";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { ProjectSkillsGrid } from "./ProjectSkillsGrid";

function pathsEqual(a: string, b: string) {
  return path.resolve(a).toLowerCase() === path.resolve(b).toLowerCase();
}

type PageProps = { params: Promise<{ key: string }> };

export default async function ProjectLibraryPage(props: PageProps) {
  const { key } = await props.params;
  let rawPath: string;
  try {
    rawPath = decodeSkillPathKey(key);
  } catch {
    notFound();
  }

  const resolved = path.resolve(rawPath.trim());
  const settings = await loadSettings();
  const watched = settings.watchedProjects.find((p) => pathsEqual(p.path, resolved));
  if (!watched) notFound();

  const label = watched.label?.trim() || path.basename(resolved);
  const skills = await scanProjectSkills(resolved, label);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 p-6 md:p-10">
      <Link
        href="/installed"
        className="group inline-flex w-fit items-center gap-2 py-2 text-sm font-bold uppercase tracking-tight text-on-background transition-colors hover:text-primary"
      >
        <MaterialIcon name="arrow_back" className="transition-transform group-hover:-translate-x-1" />
        Back to installed
      </Link>

      <header className="border-b-[3px] border-on-background pb-6">
        <h1 className="text-3xl font-bold uppercase tracking-tight md:text-4xl">{label}</h1>
        <p className="mt-2 font-mono text-sm text-on-surface-variant break-all">{resolved}</p>
        <p className="mt-3 text-on-surface-variant">
          Skills discovered under this project&apos;s watched tool paths ({skills.length} total).
        </p>
      </header>

      {skills.length === 0 ? (
        <p className="border-[3px] border-dashed border-outline bg-surface-container-low px-8 py-10 text-center font-bold uppercase text-on-surface-variant">
          No SKILL.md installs found for this project yet.
        </p>
      ) : (
        <ProjectSkillsGrid skills={skills} enabledAgentIds={settings.enabledAgentIds} />
      )}
    </div>
  );
}
