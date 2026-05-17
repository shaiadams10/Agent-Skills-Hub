import Link from "next/link";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { encodeSkillPathKey } from "@/lib/skills/skill-path-key";

export function ProjectLibraryCard({
  path,
  label,
  skillCount,
}: {
  path: string;
  label: string;
  skillCount: number;
}) {
  const href = `/installed/project/${encodeSkillPathKey(path)}`;

  return (
    <Link
      href={href}
      className="group flex flex-col gap-4 border-[3px] border-on-background bg-surface-container-lowest p-6 shadow-brutal transition-all hover:-translate-y-1 hover:shadow-brutal-hover"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center border-[3px] border-on-background bg-tertiary-fixed shadow-brutal-sm">
            <MaterialIcon name="folder_special" fill className="!text-2xl text-tertiary" />
          </div>
          <div>
            <h3 className="text-lg font-bold uppercase leading-tight group-hover:text-primary">{label}</h3>
            <p className="mt-1 font-mono text-xs text-on-surface-variant line-clamp-2" title={path}>
              {path}
            </p>
          </div>
        </div>
        <MaterialIcon
          name="arrow_forward"
          className="shrink-0 transition-transform group-hover:translate-x-0.5"
        />
      </div>
      <div className="flex items-center justify-between border-t-[3px] border-on-background pt-4">
        <span className="text-sm font-bold uppercase text-on-surface-variant">
          {skillCount === 0 ? "No skills" : `${skillCount} skill${skillCount === 1 ? "" : "s"}`}
        </span>
        <span className="text-xs font-bold uppercase text-primary">Open library</span>
      </div>
    </Link>
  );
}
