"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AGENT_LIST } from "@/lib/agents/registry-data";
import { AgentIcon } from "@/components/AgentIcon";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import Link from "next/link";

export default function SetupPage() {
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const skipAutoSave = useRef(true);

  const persist = useCallback(async (agentIds: string[]) => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          enabledAgentIds: agentIds,
          onboardingComplete: true,
        }),
      });
      if (!res.ok) throw new Error("Save failed");
      setSaved(true);
    } catch {
      setSaved(false);
    } finally {
      setSaving(false);
    }
  }, []);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((s) => {
        setSelected(s.enabledAgentIds ?? []);
        setLoading(false);
        skipAutoSave.current = false;
      })
      .catch(() => {
        setLoading(false);
        skipAutoSave.current = false;
      });
  }, []);

  useEffect(() => {
    if (loading || skipAutoSave.current) return;

    const timer = window.setTimeout(() => {
      void persist(selected);
    }, 500);

    return () => window.clearTimeout(timer);
  }, [selected, loading, persist]);

  useEffect(() => {
    function flushOnHide() {
      if (skipAutoSave.current || loading) return;
      void persist(selected);
    }

    function onVisibility() {
      if (document.visibilityState === "hidden") flushOnHide();
    }

    window.addEventListener("beforeunload", flushOnHide);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("beforeunload", flushOnHide);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [selected, loading, persist]);

  function toggle(id: string) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    setSaved(false);
  }

  async function save() {
    await persist(selected);
  }

  if (loading) {
    return <p className="p-10 text-center font-bold uppercase text-on-surface-variant">Loading…</p>;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-10 p-6 md:p-10">
      <div className="border-b-[3px] border-on-background pb-6">
        <h1 className="text-4xl font-bold uppercase tracking-tight text-primary md:text-5xl">
          Pick your assistants
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-on-surface-variant">
          We scan every supported tool folder for SKILL.md installs. Choices save automatically to{" "}
          <code className="border border-outline px-1 font-mono text-sm">~/.agent-skills-hub/settings.json</code>.
        </p>
        {saving && (
          <p className="mt-2 text-sm font-bold uppercase text-on-surface-variant">Saving…</p>
        )}
        {saved && !saving && (
          <p className="mt-2 text-sm font-bold uppercase text-secondary">Saved</p>
        )}
      </div>

      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {AGENT_LIST.map((agent) => {
          const on = selected.includes(agent.id);
          return (
            <li key={agent.id}>
              <button
                type="button"
                onClick={() => toggle(agent.id)}
                className={`flex h-full w-full flex-col border-[3px] border-on-background p-6 text-left shadow-brutal transition-all hover:-translate-y-0.5 hover:shadow-brutal-hover active:translate-x-0.5 active:translate-y-0.5 ${
                  on
                    ? "bg-primary text-on-primary"
                    : "bg-surface-container-lowest hover:bg-surface-variant"
                }`}
              >
                <div className="mb-4 flex w-full items-start justify-between">
                  <div
                    className={`flex h-14 w-14 items-center justify-center border-[3px] border-on-background ${
                      on
                        ? "bg-primary-container text-on-primary-container"
                        : "bg-surface-container-high text-primary"
                    }`}
                  >
                    <AgentIcon agentId={agent.id} size={28} />
                  </div>
                  {on ? (
                    <MaterialIcon name="check_circle" fill className="!text-2xl" />
                  ) : (
                    <span className="h-6 w-6 border-[3px] border-on-background" />
                  )}
                </div>
                <h3 className="text-lg font-bold">{agent.name}</h3>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="border-[3px] border-on-background bg-secondary px-8 py-4 text-sm font-bold uppercase text-on-secondary shadow-brutal transition-all active:translate-x-1 active:translate-y-1 active:shadow-none disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save now"}
        </button>
        {saved && (
          <Link href="/installed" className="flex items-center gap-2 font-bold uppercase text-primary underline">
            View my skills <MaterialIcon name="arrow_forward" />
          </Link>
        )}
      </div>
    </div>
  );
}
