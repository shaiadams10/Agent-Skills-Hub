/** When Setup has selections, limit Works-with badges to those tools; otherwise show all compatible. */
export function displayCompatibleAgentIds(
  compatibleAgentIds: string[],
  enabledAgentIds: string[],
): string[] {
  if (enabledAgentIds.length === 0) return compatibleAgentIds;
  const enabled = new Set(enabledAgentIds);
  return compatibleAgentIds.filter((id) => enabled.has(id));
}
