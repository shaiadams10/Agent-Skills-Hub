import { SETUP_AGENT_REGISTRY } from "./registry";

/** Client-safe agent list for Setup (excludes Hub meta installer). */
export const AGENT_LIST = SETUP_AGENT_REGISTRY.map(({ id, name }) => ({ id, name }));
