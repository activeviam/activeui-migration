import { v4 as uuid } from "uuid";

/**
 * Returns a randomly generated three character alphanumeric id.
 * Useful for creating id's for content server entries that do not already have their id's assigned.
 */
export function generateId() {
  return uuid().substring(24, 27);
}
