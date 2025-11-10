/**
 * Shared test constants used across all fixture files
 * Simplified to only include values that are actually tested
 */

// Basic identifiers
export const TEST_USER_ID = 'user123';
export const TEST_PHONE_WITH_PLUS = '+1234567890';
export const TEST_PHONE_WITHOUT_PLUS = '1234567890';
export const TEST_MESSAGE_ID = 'msg123';
export const TEST_TIMESTAMP = '2024-01-01T10:00:00Z';

// Amounts - only testing positive/negative/zero/invalid
export const TEST_AMOUNTS = {
  POSITIVE: 10.5,
  ZERO: 0,
  NEGATIVE: -10.5,
  INVALID: 'invalid', // For testing validation
  INVALID_NUMBER: 123, // For testing type validation
} as const;

// Currency
export const TEST_CURRENCY = 'USD';

// Network type
export const TEST_NETWORK_TYPE = '4G';

// Provider code
export const TEST_PROVIDER_CODE = 'PROVIDER1';

// Data usage value
export const TEST_DATA_MB = 500.5;

// Roaming data
export const TEST_ROAMING_MB = 100.25;

// Country code
export const TEST_COUNTRY = 'US';

// Billing period
export const TEST_PERIOD = {
  start: '2024-01-01T00:00:00Z',
  end: '2024-01-31T23:59:59Z',
} as const;

// Simple date strings (without time) for REST API
export const TEST_DATE_START = '2024-01-01';
export const TEST_DATE_END = '2024-01-31';
