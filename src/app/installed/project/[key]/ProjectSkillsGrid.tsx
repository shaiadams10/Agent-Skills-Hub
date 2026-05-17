"use client";

import { useRouter } from "next/navigation";
import { SkillCard } from "@/components/SkillCard";
import { SkillCardGrid } from "@/components/SkillCardGrid";
import type { InstalledSkill } from "@/lib/scanner/skill-scanner";

export function ProjectSkillsGrid({
  skills,
  enabledAgentIds = [],
}: {
  skills: InstalledSkill[];
  enabledAgentIds?: string[];
}) {
  const router = useRouter();

  return (
    <SkillCardGrid>
      {skills.map((skill) => (
        <SkillCard
          key={skill.id}
          skill={skill}
          enabledAgentIds={enabledAgentIds}
          onDeleted={() => router.refresh()}
        />
      ))}
    </SkillCardGrid>
  );
}
