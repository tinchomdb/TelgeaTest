import { TestBed } from '@angular/core/testing';
import { NormalizerService } from './normalizer.service';
import {
  MOCK_PARSED_SOAP_BASIC,
  MOCK_REST_RESPONSE_BASIC,
  MOCK_REST_UK_LARGE_DATA,
  MOCK_REST_MINIMAL_DATA,
  MOCK_REST_SWEDEN_COMPLETE,
  EXPECTED_USAGE_DATA,
} from './__fixtures__/normalizer-test-data';
import {
  TEST_USER_ID,
  TEST_PHONE_WITH_PLUS,
  TEST_MESSAGE_ID,
  TEST_TIMESTAMP,
  TEST_AMOUNTS,
  TEST_CURRENCY,
  TEST_DATA_MB,
  TEST_DATA_MB_SMALL,
  TEST_DATA_MB_LARGE,
  TEST_ROAMING_MB,
  TEST_COUNTRY,
  TEST_PERIOD,
  TEST_NETWORK_TYPE,
  TEST_PROVIDER_CODE,
} from './__fixtures__/test-constants';

describe('NormalizerService', () => {
  let service: NormalizerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NormalizerService],
    });
    service = TestBed.inject(NormalizerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('normalizeSOAPChargeSMS', () => {
    it('should transform SOAP parsed data to internal format', () => {
      const result = service.normalizeSOAPChargeSMS(MOCK_PARSED_SOAP_BASIC);

      expect(result.telgea_user_id).toBe(TEST_USER_ID);
      expect(result.msisdn).toBe(TEST_PHONE_WITH_PLUS);
      expect(result.sms_charges).toHaveLength(1);
      expect(result.sms_charges![0]).toEqual({
        message_id: TEST_MESSAGE_ID,
        timestamp: TEST_TIMESTAMP,
        amount: TEST_AMOUNTS.POSITIVE,
        currency: TEST_CURRENCY,
      });
      expect(result.billing_period.start).toBe(TEST_TIMESTAMP);
      expect(result.billing_period.end).toBe(TEST_TIMESTAMP);
    });

    it('should handle different currencies', () => {
      const result = service.normalizeSOAPChargeSMS({
        ...MOCK_PARSED_SOAP_BASIC,
        currency: TEST_CURRENCY,
      });

      expect(result.sms_charges![0].currency).toBe(TEST_CURRENCY);
      expect(result.sms_charges![0].amount).toBe(TEST_AMOUNTS.POSITIVE);
    });

    it('should handle zero amount charges', () => {
      const result = service.normalizeSOAPChargeSMS({
        ...MOCK_PARSED_SOAP_BASIC,
        chargeAmount: TEST_AMOUNTS.ZERO,
      });

      expect(result.sms_charges![0].amount).toBe(TEST_AMOUNTS.ZERO);
    });

    it('should use timestamp for both start and end of billing period', () => {
      const result = service.normalizeSOAPChargeSMS({
        ...MOCK_PARSED_SOAP_BASIC,
        timestamp: TEST_TIMESTAMP,
      });

      expect(result.billing_period.start).toBe(TEST_TIMESTAMP);
      expect(result.billing_period.end).toBe(TEST_TIMESTAMP);
    });
  });

  describe('normalizeRESTDataUsage', () => {
    it('should transform REST parsed data to internal format', () => {
      const result = service.normalizeRESTDataUsage(MOCK_REST_RESPONSE_BASIC);

      expect(result.telgea_user_id).toBe(TEST_USER_ID);
      expect(result.msisdn).toBe(TEST_PHONE_WITH_PLUS);
      expect(result.usage_data).toEqual(EXPECTED_USAGE_DATA);
      expect(result.billing_period).toEqual(TEST_PERIOD);
    });

    it('should merge network info into usage_data', () => {
      const result = service.normalizeRESTDataUsage(MOCK_REST_UK_LARGE_DATA);

      expect(result.usage_data!.network_type).toBe(TEST_NETWORK_TYPE);
      expect(result.usage_data!.provider_code).toBe(TEST_PROVIDER_CODE);
      expect(result.usage_data!.total_mb).toBe(TEST_DATA_MB_LARGE);
    });

    it('should handle optional roaming data', () => {
      const result = service.normalizeRESTDataUsage(MOCK_REST_MINIMAL_DATA);

      expect(result.usage_data!.total_mb).toBe(TEST_DATA_MB_SMALL);
      expect(result.usage_data!.roaming_mb).toBeUndefined();
      expect(result.usage_data!.country).toBeUndefined();
    });

    it('should preserve all optional usage data fields', () => {
      const result = service.normalizeRESTDataUsage(MOCK_REST_SWEDEN_COMPLETE);

      expect(result.usage_data).toEqual(EXPECTED_USAGE_DATA);
    });

    it('should not include sms_charges in REST normalization', () => {
      const result = service.normalizeRESTDataUsage(MOCK_REST_RESPONSE_BASIC);

      expect(result.sms_charges).toBeUndefined();
    });
  });
});
