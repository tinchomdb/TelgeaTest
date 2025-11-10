/**
 * Test data for Normalizer Service tests
 * Contains mock parsed data and expected normalized results for integration and unit tests
 */

import { MVNORestResponse } from '../../models/mvno-rest.dto';
import { ParsedSoapData } from '../../models/mvno-soap.dto';
import {
  TEST_USER_ID,
  TEST_PHONE_WITH_PLUS,
  TEST_MESSAGE_ID,
  TEST_TIMESTAMP,
  TEST_AMOUNTS,
  TEST_CURRENCY,
  TEST_DATA_MB,
  TEST_ROAMING_MB,
  TEST_COUNTRY,
  TEST_PERIOD,
  TEST_NETWORK_TYPE,
  TEST_PROVIDER_CODE,
} from './test-constants';

// =============================================================================
// INTEGRATION TEST DATA - For normalizer.integration.spec.ts
// =============================================================================

// Base REST JSON for integration tests
const INTEGRATION_REST_BASE = {
  user_id: TEST_USER_ID,
  msisdn: TEST_PHONE_WITH_PLUS,
  usage: {
    data: {
      total_mb: TEST_DATA_MB,
      roaming_mb: TEST_ROAMING_MB,
      country: TEST_COUNTRY,
    },
    period: TEST_PERIOD,
  },
  network: {
    type: TEST_NETWORK_TYPE,
    provider_code: TEST_PROVIDER_CODE,
  },
};

export const VALID_REST_JSON = INTEGRATION_REST_BASE;

export const EXPECTED_SOAP_NORMALIZED = {
  telgea_user_id: TEST_USER_ID,
  msisdn: TEST_PHONE_WITH_PLUS,
  sms_charges: [
    {
      message_id: TEST_MESSAGE_ID,
      timestamp: TEST_TIMESTAMP,
      amount: TEST_AMOUNTS.POSITIVE,
      currency: TEST_CURRENCY,
    },
  ],
  billing_period: {
    start: TEST_TIMESTAMP,
    end: TEST_TIMESTAMP,
  },
};

export const EXPECTED_REST_NORMALIZED = {
  telgea_user_id: INTEGRATION_REST_BASE.user_id,
  msisdn: INTEGRATION_REST_BASE.msisdn,
  usage_data: {
    total_mb: INTEGRATION_REST_BASE.usage.data.total_mb,
    roaming_mb: INTEGRATION_REST_BASE.usage.data.roaming_mb,
    country: INTEGRATION_REST_BASE.usage.data.country,
    network_type: INTEGRATION_REST_BASE.network.type,
    provider_code: INTEGRATION_REST_BASE.network.provider_code,
  },
  billing_period: {
    start: INTEGRATION_REST_BASE.usage.period.start,
    end: INTEGRATION_REST_BASE.usage.period.end,
  },
};

// =============================================================================
// UNIT TEST MOCKS - For normalizer.service.spec.ts unit tests
// =============================================================================

// Base SOAP parsed data - single source for all SOAP tests
export const MOCK_PARSED_SOAP_BASIC: ParsedSoapData = {
  userId: TEST_USER_ID,
  phoneNumber: TEST_PHONE_WITH_PLUS,
  messageId: TEST_MESSAGE_ID,
  timestamp: TEST_TIMESTAMP,
  chargeAmount: TEST_AMOUNTS.POSITIVE,
  currency: TEST_CURRENCY,
};

// Base REST response data - single source for all REST tests
export const MOCK_REST_RESPONSE_BASIC: MVNORestResponse = {
  user_id: TEST_USER_ID,
  msisdn: TEST_PHONE_WITH_PLUS,
  usage: {
    data: {
      total_mb: TEST_DATA_MB,
      roaming_mb: TEST_ROAMING_MB,
      country: TEST_COUNTRY,
    },
    period: TEST_PERIOD,
  },
  network: {
    type: TEST_NETWORK_TYPE,
    provider_code: TEST_PROVIDER_CODE,
  },
};

// Expected normalized usage_data shape (commonly used in unit test assertions)
export const EXPECTED_USAGE_DATA = {
  total_mb: TEST_DATA_MB,
  roaming_mb: TEST_ROAMING_MB,
  country: TEST_COUNTRY,
  network_type: TEST_NETWORK_TYPE,
  provider_code: TEST_PROVIDER_CODE,
} as const;

// REST response with minimal data (only total_mb, no optional roaming/country)
export const MOCK_REST_MINIMAL_DATA: MVNORestResponse = {
  user_id: TEST_USER_ID,
  msisdn: TEST_PHONE_WITH_PLUS,
  usage: {
    data: {
      total_mb: TEST_DATA_MB,
    },
    period: TEST_PERIOD,
  },
  network: {
    type: TEST_NETWORK_TYPE,
    provider_code: TEST_PROVIDER_CODE,
  },
};
