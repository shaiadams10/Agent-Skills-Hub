"use client";

import { useRouter } from "next/navigation";
import { SkillCard } from "@/components/SkillCard";
import { SkillCardGrid } from "@/components/SkillCardGrid";
import type { InstalledSkill } from "@/lib/scanner/skill-scanner";

export function ProjectSkillsGrid({ skills }: { skills: InstalledSkill[] }) {
  const router = useRouter();

  return (
    <SkillCardGrid>
      {skills.map((skill) => (
        <SkillCard key={skill.id} skill={skill} onDeleted={() => router.refresh()} />
      ))}
    </SkillCardGrid>
  );
}
