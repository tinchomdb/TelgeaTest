/**
 * Test data for REST Parser Service tests
 * Contains various REST JSON scenarios including valid, invalid, and edge cases
 * Uses a base object pattern to reduce repetition
 */

import {
  TEST_USER_ID,
  TEST_PHONE_WITHOUT_PLUS,
  TEST_DATA_MB,
  TEST_PERIOD,
  TEST_DATE_START,
  TEST_DATE_END,
  TEST_NETWORK_TYPE,
  TEST_PROVIDER_CODE,
  TEST_AMOUNTS,
} from './test-constants';

// Base valid REST response
const BASE_REST_RESPONSE = {
  user_id: TEST_USER_ID,
  msisdn: TEST_PHONE_WITHOUT_PLUS,
  usage: {
    data: { consumed: TEST_DATA_MB },
    period: { ...TEST_PERIOD, start: TEST_DATE_START, end: TEST_DATE_END },
  },
  network: {
    type: TEST_NETWORK_TYPE,
    provider_code: TEST_PROVIDER_CODE,
  },
} as const;

// Valid response
export const REST_PARSER_VALID = BASE_REST_RESPONSE;

// User ID variations
export const REST_PARSER_MISSING_USER_ID = (({ user_id, ...rest }) => rest)(BASE_REST_RESPONSE);

export const REST_PARSER_EMPTY_USER_ID = {
  ...BASE_REST_RESPONSE,
  user_id: '',
};

export const REST_PARSER_WHITESPACE_USER_ID = {
  ...BASE_REST_RESPONSE,
  user_id: '   ',
};

// MSISDN variations
export const REST_PARSER_MISSING_MSISDN = (({ msisdn, ...rest }) => rest)(BASE_REST_RESPONSE);

export const REST_PARSER_EMPTY_MSISDN = {
  ...BASE_REST_RESPONSE,
  msisdn: '',
};

// Usage variations
export const REST_PARSER_MISSING_USAGE = (({ usage, ...rest }) => rest)(BASE_REST_RESPONSE);

export const REST_PARSER_INVALID_USAGE = {
  ...BASE_REST_RESPONSE,
  usage: 'invalid' as any,
};

export const REST_PARSER_MISSING_USAGE_DATA = {
  ...BASE_REST_RESPONSE,
  usage: {
    period: BASE_REST_RESPONSE.usage.period,
  },
};

export const REST_PARSER_MISSING_USAGE_PERIOD = {
  ...BASE_REST_RESPONSE,
  usage: {
    data: BASE_REST_RESPONSE.usage.data,
  },
};

// Network variations
export const REST_PARSER_MISSING_NETWORK = (({ network, ...rest }) => rest)(BASE_REST_RESPONSE);

export const REST_PARSER_INVALID_NETWORK = {
  ...BASE_REST_RESPONSE,
  network: 'invalid' as any,
};

export const REST_PARSER_MISSING_NETWORK_TYPE = {
  ...BASE_REST_RESPONSE,
  network: {
    provider_code: BASE_REST_RESPONSE.network.provider_code,
  },
};

export const REST_PARSER_MISSING_PROVIDER_CODE = {
  ...BASE_REST_RESPONSE,
  network: {
    type: BASE_REST_RESPONSE.network.type,
  },
};

export const REST_PARSER_INVALID_NETWORK_TYPE = {
  ...BASE_REST_RESPONSE,
  network: {
    ...BASE_REST_RESPONSE.network,
    type: TEST_AMOUNTS.INVALID_NUMBER as any,
  },
};

export const REST_PARSER_INVALID_PROVIDER_CODE = {
  ...BASE_REST_RESPONSE,
  network: {
    ...BASE_REST_RESPONSE.network,
    provider_code: TEST_AMOUNTS.INVALID_NUMBER as any,
  },
};
