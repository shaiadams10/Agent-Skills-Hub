import path from "path";
import { getAgentName, type SkillScope } from "@/lib/agents/registry";
import type { ParsedSkill } from "@/lib/scanner/parse-skill";

export type InstallOriginKind = "manual" | "agent" | "unknown";

export type InstallConfidence = "declared" | "high" | "medium" | "low";

/**
 * Provenance for a skill folder.
 *
 *   "agent"   — verified that a coding-agent platform put this skill on disk.
 *               Either the SKILL.md author declared it, or the folder lives in
 *               a place the tool clearly owns (bundled templates / the tool's
 *               managed install home for user-wide skills).
 *   "manual"  — default. The user (or someone helping them) placed the skill
 *               there. The documented `.<tool>/skills` paths are user-authoring
 *               conventions, not auto-install destinations, so we do *not*
 *               attribute on directory name alone.
 *   "unknown" — only used when the SKILL.md author explicitly declared it.
 */
export type InstallOrigin = {
  kind: InstallOriginKind;
  /** Short label for chips, e.g. "Manually Installed" | "Installed By OpenAI Codex" */
  summary: string;
  detail: string;
  source: "declared" | "heuristic";
  installedByAgentId?: string;
  confidence: InstallConfidence;
};

// ---------------------------------------------------------------------------
// Per-agent provisioning signals.
//
// Each agent can declare three kinds of evidence we'll use to tag a skill as
// "Installed By <agent>" without an explicit frontmatter declaration:
//
//   bundled          – paths where the tool itself ships skills as part of
//                      its install (e.g. Codex `.system/` templates).
//                      Highest evidence.
//
//   managedGlobal    – the user-wide path the tool's own installer writes to
//                      (e.g. `~/.codex/skills/` for `skill-installer`). Only
//                      applies to scope=global; project copies are almost
//                      always user-authored. Medium evidence.
//
//   installerGitRemotes – reserved for a future enrichment phase: if a skill
//                      folder is a clone of one of these remotes, we can
//                      bump confidence to high. Wiring is TODO once we
//                      capture origin URLs in the git update cache.
//
// To support a new agent, append to AGENT_PROVISIONING_SIGNALS below. No
// changes to the resolver are needed.
// ---------------------------------------------------------------------------

type ProvisioningSignals = {
  agentId: string;
  bundled?: {
    /** All markers must appear in the absolute path (case-insensitive). */
    pathMarkers: string[];
    rationale: string;
  };
  managedGlobal?: {
    /** Relative paths (under home) the tool's installer uses for global skills. */
    relativePaths: string[];
    rationale: string;
  };
  installerGitRemotes?: {
    patterns: RegExp[];
    rationale: string;
  };
};

const AGENT_PROVISIONING_SIGNALS: ProvisioningSignals[] = [
  {
    agentId: "codex",
    bundled: {
      pathMarkers: [".codex/skills", "/.system/"],
      rationale:
        "Located under `.codex/skills/.system/` — Codex's documented system folder for templates that ship with the install (see github.com/openai/skills).",
    },
    managedGlobal: {
      relativePaths: [".codex/skills"],
      rationale:
        "Lives in the user-wide `~/.codex/skills` folder, where Codex's `skill-installer` deposits skills. Globally-installed Codex skills are very rarely placed by hand — they're added by Codex's own installer flow or `git clone` from openai/skills.",
    },
    installerGitRemotes: {
      patterns: [/github\.com[/:]openai\/skills(?:\.git)?$/i],
      rationale:
        "Skill folder is a git clone of openai/skills — Codex's curated skill catalog.",
    },
  },
  {
    agentId: "antigravity",
    managedGlobal: {
      // The Antigravity IDE owns every subfolder of ~/.gemini/ except the
      // bare `.gemini/skills` directory (that one is the Gemini CLI's user
      // scope). The IDE rotates skills between active / backup / ide / config
      // copies across versions; all four are seen in the wild.
      relativePaths: [
        ".gemini/antigravity/skills",
        ".gemini/antigravity-ide/skills",
        ".gemini/antigravity-backup/skills",
        ".gemini/config/skills",
      ],
      rationale:
        "Lives in a Google Antigravity IDE-managed folder under `~/.gemini/`. The IDE bundles a Gemini CLI fork that copies skills into these locations (`antigravity/skills` is the documented active path; `antigravity-ide`, `antigravity-backup`, and `config/skills` are observed sibling copies). They are not standard user-authoring locations.",
    },
  },
  {
    agentId: "gemini-cli",
    managedGlobal: {
      relativePaths: [".gemini/skills"],
      rationale:
        "Lives in the user-wide `~/.gemini/skills` folder, where `gemini skills install --scope user` deposits skills (see geminicli.com/docs/cli/skills). Skills here are typically installed by the CLI rather than authored by hand.",
    },
  },
  // Other agents intentionally have no entries yet. We've reviewed each
  // platform's docs and only Codex / Antigravity / Gemini CLI currently
  // auto-provision skills. Add new entries here when a tool ships a
  // skill-installer or bundles built-ins (Claude Code, Cursor, Copilot, etc.).
];

// ---------------------------------------------------------------------------
// Path → primary owner mapping (used ONLY for the declared-but-unspecified
// case: author wrote `install_source: agent_tool` without `installed_by`).
// Never on its own promotes a skill to "Installed By X".
// ---------------------------------------------------------------------------

type PathOwnerRule = {
  test: (relNorm: string) => boolean;
  agentId: string;
  rationale: string;
};

const PATH_PRIMARY_OWNER_RULES: PathOwnerRule[] = [
  { test: (r) => r.includes(".github/skills"), agentId: "copilot", rationale: "GitHub Copilot's documented project path is `.github/skills`." },
  { test: (r) => r.includes(".copilot/skills"), agentId: "copilot", rationale: "GitHub Copilot's documented global path is `~/.copilot/skills`." },
  { test: (r) => r.includes(".codex/skills"), agentId: "codex", rationale: "OpenAI Codex's documented path is `.codex/skills`." },
  // Order matters: more specific Antigravity (and antigravity-* sibling) paths
  // are checked before the generic `.gemini/skills` rule so the same `.gemini/`
  // tree doesn't get mis-attributed to plain Gemini CLI.
  { test: (r) => r.includes(".gemini/antigravity"), agentId: "antigravity", rationale: "Antigravity IDE's user-wide skills location under `~/.gemini/antigravity/` (and sibling `antigravity-ide` / `antigravity-backup` folders)." },
  { test: (r) => r.includes(".gemini/config/skills"), agentId: "antigravity", rationale: "Antigravity IDE config-managed skills under `~/.gemini/config/skills`." },
  { test: (r) => r.includes(".gemini/skills"), agentId: "gemini-cli", rationale: "Gemini CLI's documented path is `.gemini/skills`." },
  { test: (r) => r.includes(".windsurf/skills") || r.includes(".codeium/windsurf/skills"), agentId: "windsurf", rationale: "Windsurf's documented paths are `.windsurf/skills` and `~/.codeium/windsurf/skills`." },
  { test: (r) => r.includes(".kilo/skills"), agentId: "kilo", rationale: "Kilo Code's documented path is `.kilo/skills`." },
  { test: (r) => r.includes(".hermes/skills"), agentId: "hermes", rationale: "Hermes Agent's documented path is `~/.hermes/skills`." },
  { test: (r) => r.includes(".agent/skills"), agentId: "antigravity", rationale: "Antigravity's documented project path is `.agent/skills`." },
  { test: (r) => r.includes(".opencode/skills") || r.includes(".config/opencode/skills"), agentId: "opencode", rationale: "OpenCode's documented paths are `.opencode/skills` and `~/.config/opencode/skills`." },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function normPath(p: string): string {
  return p.replace(/\\/g, "/").toLowerCase();
}

function installedBySummary(agentId: string): string {
  return `Installed By ${getAgentName(agentId)}`;
}

function manualOrigin(
  detail: string,
  source: "declared" | "heuristic",
  confidence: InstallConfidence,
): InstallOrigin {
  return { kind: "manual", summary: "Manually Installed", detail, source, confidence };
}

function agentOrigin(
  agentId: string,
  detail: string,
  source: "declared" | "heuristic",
  confidence: InstallConfidence,
): InstallOrigin {
  return {
    kind: "agent",
    summary: installedBySummary(agentId),
    detail,
    source,
    installedByAgentId: agentId,
    confidence,
  };
}

function inferPrimaryOwner(skillsRootRelative: string): PathOwnerRule | undefined {
  const relNorm = normPath(skillsRootRelative);
  return PATH_PRIMARY_OWNER_RULES.find((rule) => rule.test(relNorm));
}

function matchBundledSignal(absPathNorm: string): ProvisioningSignals | undefined {
  return AGENT_PROVISIONING_SIGNALS.find((sig) => {
    if (!sig.bundled) return false;
    return sig.bundled.pathMarkers.every((marker) => absPathNorm.includes(marker.toLowerCase()));
  });
}

function matchManagedGlobalSignal(
  scope: SkillScope,
  skillsRootRelativeNorm: string,
  absPathNorm: string,
): ProvisioningSignals | undefined {
  if (scope !== "global") return undefined;
  return AGENT_PROVISIONING_SIGNALS.find((sig) => {
    if (!sig.managedGlobal) return false;
    // The skill must live in the tool's managed home but *not* inside that
    // home's bundled subtree — bundled is a higher-confidence match handled
    // separately above.
    if (sig.bundled && sig.bundled.pathMarkers.every((m) => absPathNorm.includes(m.toLowerCase()))) {
      return false;
    }
    return sig.managedGlobal.relativePaths.some((rel) =>
      skillsRootRelativeNorm.includes(normPath(rel)),
    );
  });
}

// ---------------------------------------------------------------------------
// Public entry point
// ---------------------------------------------------------------------------

export function resolveInstallOrigin(opts: {
  skillPath: string;
  skillDirName: string;
  skillsRootRelative: string;
  scope: SkillScope;
  compatibleAgentIds: string[];
  parsed: ParsedSkill;
}): InstallOrigin {
  const declared = opts.parsed.installSource;
  const explicitAgent = opts.parsed.installedByAgentId;

  // 1. Author-declared provenance always wins.
  if (declared === "manual") {
    return manualOrigin("Declared in SKILL.md (install_source: manual).", "declared", "declared");
  }

  if (declared === "agent_tool") {
    if (explicitAgent) {
      return agentOrigin(
        explicitAgent,
        `Declared in SKILL.md (install_source: agent_tool, installed_by: ${explicitAgent}).`,
        "declared",
        "declared",
      );
    }
    const owner = inferPrimaryOwner(opts.skillsRootRelative);
    if (owner && owner.agentId !== "cursor") {
      return agentOrigin(
        owner.agentId,
        `Declared as agent_tool install; attributed to ${getAgentName(owner.agentId)} from canonical path (${owner.rationale}). Add installed_by to SKILL.md for a precise label.`,
        "declared",
        "medium",
      );
    }
    return {
      kind: "agent",
      summary: "Installed By coding agent",
      detail:
        "Declared in SKILL.md (install_source: agent_tool) without installed_by. Add installed_by: <agent id> (e.g. codex, cursor, copilot) for a precise label.",
      source: "declared",
      confidence: "low",
    };
  }

  if (declared === "unknown") {
    return {
      kind: "unknown",
      summary: "Unknown origin",
      detail: "Declared in SKILL.md (install_source: unknown).",
      source: "declared",
      confidence: "declared",
    };
  }

  // 2. No declaration — apply heuristics tier-by-tier.
  const skillsRootRelativeNorm = normPath(opts.skillsRootRelative);
  const absPathNorm = normPath(path.resolve(opts.skillPath));

  // Tier A: bundled (tool ships this as part of its install)
  const bundled = matchBundledSignal(absPathNorm);
  if (bundled?.bundled) {
    return agentOrigin(bundled.agentId, bundled.bundled.rationale, "heuristic", "high");
  }

  // Tier B: managed-global (tool's own installer writes to this user-wide path)
  const managed = matchManagedGlobalSignal(opts.scope, skillsRootRelativeNorm, absPathNorm);
  if (managed?.managedGlobal) {
    return agentOrigin(
      managed.agentId,
      `${managed.managedGlobal.rationale} If you placed this here by hand, set install_source: manual in SKILL.md to override.`,
      "heuristic",
      "medium",
    );
  }

  // Tier C: default — the user authored or copied it themselves.
  const owner = inferPrimaryOwner(opts.skillsRootRelative);
  const ownerHint = owner
    ? ` This folder is ${getAgentName(owner.agentId)}'s documented skills location, but that path is a user-authoring convention — the tool doesn't auto-install skills there.`
    : "";
  return manualOrigin(
    `No frontmatter declaration and no signal that a coding-agent platform provisioned this skill (e.g. a bundled template path or the tool's managed install home).${ownerHint} Set install_source: agent_tool + installed_by: <agent id> in SKILL.md if a tool actually placed it here.`,
    "heuristic",
    "medium",
  );
}

// ---------------------------------------------------------------------------
// Exports for future use (e.g. enriching install origin with git remote info).
// ---------------------------------------------------------------------------

export const __INTERNAL = {
  AGENT_PROVISIONING_SIGNALS,
};
