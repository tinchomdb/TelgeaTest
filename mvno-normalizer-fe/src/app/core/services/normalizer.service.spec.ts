import { TestBed } from '@angular/core/testing';
import { NormalizerService } from './normalizer.service';
import { XmlParserService } from './xml-parser.service';
import { RestParserService } from './rest-parser.service';
import { VALIDATION_ERRORS } from '../constants/validation-errors';
import {
  VALID_SOAP_XML,
  SOAP_XML_MISSING_USER_ID,
  SOAP_XML_MISSING_PHONE,
  SOAP_XML_INVALID_AMOUNT,
  SOAP_XML_NEGATIVE_AMOUNT,
  SOAP_XML_MALFORMED,
  VALID_REST_JSON,
  EXPECTED_SOAP_NORMALIZED,
  EXPECTED_REST_NORMALIZED,
} from './__fixtures__/normalizer-test-data';

describe('NormalizerService Integration Tests', () => {
  let normalizerService: NormalizerService;
  let xmlParserService: XmlParserService;
  let restParserService: RestParserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NormalizerService, XmlParserService, RestParserService],
    });
    normalizerService = TestBed.inject(NormalizerService);
    xmlParserService = TestBed.inject(XmlParserService);
    restParserService = TestBed.inject(RestParserService);
  });

  describe('SOAP Normalization', () => {
    it('should correctly normalize valid SOAP XML', () => {
      const parsedSoap = xmlParserService.parseSOAPCharge(VALID_SOAP_XML);
      const normalized = normalizerService.normalizeSOAPChargeSMS(parsedSoap);

      expect(normalized).toEqual(EXPECTED_SOAP_NORMALIZED);
    });

    it('should throw error when UserID is missing', () => {
      expect(() => xmlParserService.parseSOAPCharge(SOAP_XML_MISSING_USER_ID)).toThrow(
        VALIDATION_ERRORS.SOAP_MISSING_USER_ID
      );
    });

    it('should throw error when PhoneNumber is missing', () => {
      expect(() => xmlParserService.parseSOAPCharge(SOAP_XML_MISSING_PHONE)).toThrow(
        VALIDATION_ERRORS.SOAP_MISSING_PHONE
      );
    });

    it('should throw error when ChargeAmount is invalid', () => {
      expect(() => xmlParserService.parseSOAPCharge(SOAP_XML_INVALID_AMOUNT)).toThrow(
        VALIDATION_ERRORS.SOAP_INVALID_AMOUNT_FORMAT
      );
    });

    it('should throw error when ChargeAmount is negative', () => {
      expect(() => xmlParserService.parseSOAPCharge(SOAP_XML_NEGATIVE_AMOUNT)).toThrow(
        VALIDATION_ERRORS.SOAP_NEGATIVE_AMOUNT
      );
    });

    it('should throw error when XML is malformed', () => {
      expect(() => xmlParserService.parseSOAPCharge(SOAP_XML_MALFORMED)).toThrow(
        VALIDATION_ERRORS.SOAP_INVALID_XML
      );
    });
  });

  describe('REST Normalization', () => {
    it('should correctly normalize valid REST JSON', () => {
      const validRestString = JSON.stringify(VALID_REST_JSON);
      const parsedRest = restParserService.parseRESTDataUsage(validRestString);
      const normalized = normalizerService.normalizeRESTDataUsage(parsedRest);

      expect(normalized).toEqual(EXPECTED_REST_NORMALIZED);
    });

    it('should throw error when user_id is missing', () => {
      const invalidJson = { ...VALID_REST_JSON };
      delete (invalidJson as any).user_id;

      expect(() => restParserService.parseRESTDataUsage(JSON.stringify(invalidJson))).toThrow(
        VALIDATION_ERRORS.REST_MISSING_USER_ID
      );
    });

    it('should throw error when msisdn is missing', () => {
      const invalidJson = { ...VALID_REST_JSON };
      delete (invalidJson as any).msisdn;

      expect(() => restParserService.parseRESTDataUsage(JSON.stringify(invalidJson))).toThrow(
        VALIDATION_ERRORS.REST_MISSING_MSISDN
      );
    });

    it('should throw error when user_id is empty string', () => {
      const invalidJson = { ...VALID_REST_JSON, user_id: '' };

      expect(() => restParserService.parseRESTDataUsage(JSON.stringify(invalidJson))).toThrow(
        VALIDATION_ERRORS.REST_MISSING_USER_ID
      );
    });

    it('should throw error when usage is missing', () => {
      const invalidJson = { ...VALID_REST_JSON };
      delete (invalidJson as any).usage;

      expect(() => restParserService.parseRESTDataUsage(JSON.stringify(invalidJson))).toThrow(
        VALIDATION_ERRORS.REST_MISSING_USAGE
      );
    });

    it('should throw error when network is missing', () => {
      const invalidJson = { ...VALID_REST_JSON };
      delete (invalidJson as any).network;

      expect(() => restParserService.parseRESTDataUsage(JSON.stringify(invalidJson))).toThrow(
        VALIDATION_ERRORS.REST_MISSING_NETWORK
      );
    });

    it('should throw error when JSON is invalid', () => {
      expect(() => restParserService.parseRESTDataUsage('invalid json')).toThrow(
        'Invalid JSON format'
      );
    });

    it('should throw error when data is not an object', () => {
      expect(() => restParserService.parseRESTDataUsage('"not an object"')).toThrow(
        VALIDATION_ERRORS.REST_INVALID_OBJECT
      );
    });

    it('should throw error when data is null', () => {
      expect(() => restParserService.parseRESTDataUsage('null')).toThrow(
        VALIDATION_ERRORS.REST_INVALID_OBJECT
      );
    });

    it('should throw error when data is an array', () => {
      expect(() => restParserService.parseRESTDataUsage('[]')).toThrow(
        VALIDATION_ERRORS.REST_INVALID_OBJECT
      );
    });
  });
});
