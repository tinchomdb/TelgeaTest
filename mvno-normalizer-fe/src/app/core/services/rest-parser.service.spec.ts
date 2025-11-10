import { TestBed } from '@angular/core/testing';
import { RestParserService } from './rest-parser.service';
import { ValidationService } from './validation.service';
import { VALIDATION_ERRORS } from '../constants/validation-errors';
import * as TestData from './__fixtures__/rest-parser-test-data';
import { TEST_USER_ID, TEST_PHONE_WITHOUT_PLUS } from './__fixtures__/test-constants';

describe('RestParserService', () => {
  let service: RestParserService;
  let validationService: ValidationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RestParserService, ValidationService],
    });
    service = TestBed.inject(RestParserService);
    validationService = TestBed.inject(ValidationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('parseRESTDataUsage', () => {
    const validJson = JSON.stringify(TestData.REST_PARSER_VALID);

    it('should parse valid REST JSON successfully', () => {
      const result = service.parseRESTDataUsage(validJson);

      expect(result.user_id).toBe(TEST_USER_ID);
      expect(result.msisdn).toBe(TEST_PHONE_WITHOUT_PLUS);
      expect(result.usage).toBeDefined();
      expect(result.network).toBeDefined();
    });

    it('should throw error for invalid JSON format', () => {
      const invalidJson = 'not valid json';

      expect(() => service.parseRESTDataUsage(invalidJson)).toThrow(
        VALIDATION_ERRORS.REST_INVALID_JSON
      );
    });

    it('should throw error when data is not an object', () => {
      const arrayJson = JSON.stringify([1, 2, 3]);

      expect(() => service.parseRESTDataUsage(arrayJson)).toThrow(
        VALIDATION_ERRORS.REST_INVALID_OBJECT
      );
    });

    it('should throw error when data is null', () => {
      const nullJson = JSON.stringify(null);

      expect(() => service.parseRESTDataUsage(nullJson)).toThrow(
        VALIDATION_ERRORS.REST_INVALID_OBJECT
      );
    });

    it('should throw error when user_id is missing', () => {
      const json = JSON.stringify(TestData.REST_PARSER_MISSING_USER_ID);

      expect(() => service.parseRESTDataUsage(json)).toThrow(
        VALIDATION_ERRORS.REST_MISSING_USER_ID
      );
    });

    it('should throw error when user_id is empty string', () => {
      const json = JSON.stringify(TestData.REST_PARSER_EMPTY_USER_ID);

      expect(() => service.parseRESTDataUsage(json)).toThrow(
        VALIDATION_ERRORS.REST_MISSING_USER_ID
      );
    });

    it('should throw error when user_id is whitespace only', () => {
      const json = JSON.stringify(TestData.REST_PARSER_WHITESPACE_USER_ID);

      expect(() => service.parseRESTDataUsage(json)).toThrow(
        VALIDATION_ERRORS.REST_MISSING_USER_ID
      );
    });

    it('should throw error when msisdn is missing', () => {
      const json = JSON.stringify(TestData.REST_PARSER_MISSING_MSISDN);

      expect(() => service.parseRESTDataUsage(json)).toThrow(VALIDATION_ERRORS.REST_MISSING_MSISDN);
    });

    it('should throw error when msisdn is empty string', () => {
      const json = JSON.stringify(TestData.REST_PARSER_EMPTY_MSISDN);

      expect(() => service.parseRESTDataUsage(json)).toThrow(VALIDATION_ERRORS.REST_MISSING_MSISDN);
    });

    it('should throw error when usage is missing', () => {
      const json = JSON.stringify(TestData.REST_PARSER_MISSING_USAGE);

      expect(() => service.parseRESTDataUsage(json)).toThrow(VALIDATION_ERRORS.REST_MISSING_USAGE);
    });

    it('should throw error when usage is not an object', () => {
      const json = JSON.stringify(TestData.REST_PARSER_INVALID_USAGE);

      expect(() => service.parseRESTDataUsage(json)).toThrow(VALIDATION_ERRORS.REST_MISSING_USAGE);
    });

    it('should throw error when usage.data is missing', () => {
      const json = JSON.stringify(TestData.REST_PARSER_MISSING_USAGE_DATA);

      expect(() => service.parseRESTDataUsage(json)).toThrow(VALIDATION_ERRORS.REST_MISSING_USAGE);
    });

    it('should throw error when usage.period is missing', () => {
      const json = JSON.stringify(TestData.REST_PARSER_MISSING_USAGE_PERIOD);

      expect(() => service.parseRESTDataUsage(json)).toThrow(VALIDATION_ERRORS.REST_MISSING_USAGE);
    });

    it('should throw error when network is missing', () => {
      const json = JSON.stringify(TestData.REST_PARSER_MISSING_NETWORK);

      expect(() => service.parseRESTDataUsage(json)).toThrow(
        VALIDATION_ERRORS.REST_MISSING_NETWORK
      );
    });

    it('should throw error when network is not an object', () => {
      const json = JSON.stringify(TestData.REST_PARSER_INVALID_NETWORK);

      expect(() => service.parseRESTDataUsage(json)).toThrow(
        VALIDATION_ERRORS.REST_MISSING_NETWORK
      );
    });

    it('should throw error when network.type is missing', () => {
      const json = JSON.stringify(TestData.REST_PARSER_MISSING_NETWORK_TYPE);

      expect(() => service.parseRESTDataUsage(json)).toThrow(
        VALIDATION_ERRORS.REST_MISSING_NETWORK
      );
    });

    it('should throw error when network.provider_code is missing', () => {
      const json = JSON.stringify(TestData.REST_PARSER_MISSING_PROVIDER_CODE);

      expect(() => service.parseRESTDataUsage(json)).toThrow(
        VALIDATION_ERRORS.REST_MISSING_NETWORK
      );
    });

    it('should throw error when network.type is not a string', () => {
      const json = JSON.stringify(TestData.REST_PARSER_INVALID_NETWORK_TYPE);

      expect(() => service.parseRESTDataUsage(json)).toThrow(
        VALIDATION_ERRORS.REST_MISSING_NETWORK
      );
    });

    it('should throw error when network.provider_code is not a string', () => {
      const json = JSON.stringify(TestData.REST_PARSER_INVALID_PROVIDER_CODE);

      expect(() => service.parseRESTDataUsage(json)).toThrow(
        VALIDATION_ERRORS.REST_MISSING_NETWORK
      );
    });
  });
});
