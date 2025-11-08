/**
 * Common type definitions used across the application
 */

/**
 * Represents raw/untrusted data from external sources (HTTP requests, files, etc.)
 * Must be validated before use in application logic
 *
 * This type signals to developers that the data is unvalidated and requires
 * proper type guards and validation before it can be safely used
 */
export type RawData = Record<string, unknown>;
