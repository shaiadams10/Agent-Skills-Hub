import { AGENT_REGISTRY } from "./registry";

/** Client-safe agent list (single source: `AGENT_REGISTRY`). */
export const AGENT_LIST = AGENT_REGISTRY.map(({ id, name }) => ({ id, name }));
