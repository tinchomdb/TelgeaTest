import { TestBed } from '@angular/core/testing';
import { NormalizerService } from './normalizer.service';
import { XmlParserService } from './xml-parser.service';
import { RestParserService } from './rest-parser.service';
import { ValidationService } from './validation.service';
import { VALIDATION_ERRORS } from '../constants/validation-errors';
import {
  XML_PARSER_VALID,
  XML_PARSER_MISSING_USER_ID,
  XML_PARSER_MISSING_PHONE,
  XML_PARSER_INVALID_AMOUNT,
  XML_PARSER_NEGATIVE_AMOUNT,
  XML_PARSER_MALFORMED,
} from './__fixtures__/xml-parser-test-data';
import {
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
      providers: [NormalizerService, XmlParserService, RestParserService, ValidationService],
    });
    normalizerService = TestBed.inject(NormalizerService);
    xmlParserService = TestBed.inject(XmlParserService);
    restParserService = TestBed.inject(RestParserService);
  });

  describe('Complete SOAP Flow', () => {
    it('should parse and normalize valid SOAP XML end-to-end', () => {
      const parsedSoap = xmlParserService.parseSOAPCharge(XML_PARSER_VALID);
      const normalized = normalizerService.normalizeSOAPChargeSMS(parsedSoap);

      expect(normalized).toEqual(EXPECTED_SOAP_NORMALIZED);
    });

    it('should fail early when SOAP XML has missing UserID', () => {
      expect(() => xmlParserService.parseSOAPCharge(XML_PARSER_MISSING_USER_ID)).toThrow(
        VALIDATION_ERRORS.SOAP_MISSING_USER_ID
      );
    });

    it('should fail early when SOAP XML has missing PhoneNumber', () => {
      expect(() => xmlParserService.parseSOAPCharge(XML_PARSER_MISSING_PHONE)).toThrow(
        VALIDATION_ERRORS.SOAP_MISSING_PHONE
      );
    });

    it('should fail early when SOAP XML has invalid ChargeAmount', () => {
      expect(() => xmlParserService.parseSOAPCharge(XML_PARSER_INVALID_AMOUNT)).toThrow(
        VALIDATION_ERRORS.SOAP_INVALID_AMOUNT_FORMAT
      );
    });

    it('should fail early when SOAP XML has negative ChargeAmount', () => {
      expect(() => xmlParserService.parseSOAPCharge(XML_PARSER_NEGATIVE_AMOUNT)).toThrow(
        VALIDATION_ERRORS.SOAP_NEGATIVE_AMOUNT
      );
    });

    it('should fail early when SOAP XML is malformed', () => {
      expect(() => xmlParserService.parseSOAPCharge(XML_PARSER_MALFORMED)).toThrow(
        VALIDATION_ERRORS.SOAP_INVALID_XML
      );
    });
  });

  describe('Complete REST Flow', () => {
    it('should parse and normalize valid REST JSON end-to-end', () => {
      const validRestString = JSON.stringify(VALID_REST_JSON);
      const parsedRest = restParserService.parseRESTDataUsage(validRestString);
      const normalized = normalizerService.normalizeRESTDataUsage(parsedRest);

      expect(normalized).toEqual(EXPECTED_REST_NORMALIZED);
    });

    it('should fail early when REST JSON has missing user_id', () => {
      const invalidJson = { ...VALID_REST_JSON };
      delete (invalidJson as any).user_id;

      expect(() => restParserService.parseRESTDataUsage(JSON.stringify(invalidJson))).toThrow(
        VALIDATION_ERRORS.REST_MISSING_USER_ID
      );
    });

    it('should fail early when REST JSON has missing msisdn', () => {
      const invalidJson = { ...VALID_REST_JSON };
      delete (invalidJson as any).msisdn;

      expect(() => restParserService.parseRESTDataUsage(JSON.stringify(invalidJson))).toThrow(
        VALIDATION_ERRORS.REST_MISSING_MSISDN
      );
    });

    it('should fail early when REST JSON has empty user_id', () => {
      const invalidJson = { ...VALID_REST_JSON, user_id: '' };

      expect(() => restParserService.parseRESTDataUsage(JSON.stringify(invalidJson))).toThrow(
        VALIDATION_ERRORS.REST_MISSING_USER_ID
      );
    });

    it('should fail early when REST JSON has missing usage', () => {
      const invalidJson = { ...VALID_REST_JSON };
      delete (invalidJson as any).usage;

      expect(() => restParserService.parseRESTDataUsage(JSON.stringify(invalidJson))).toThrow(
        VALIDATION_ERRORS.REST_MISSING_USAGE
      );
    });

    it('should fail early when REST JSON has missing network', () => {
      const invalidJson = { ...VALID_REST_JSON };
      delete (invalidJson as any).network;

      expect(() => restParserService.parseRESTDataUsage(JSON.stringify(invalidJson))).toThrow(
        VALIDATION_ERRORS.REST_MISSING_NETWORK
      );
    });

    it('should fail early when REST JSON is invalid', () => {
      expect(() => restParserService.parseRESTDataUsage('invalid json')).toThrow(
        VALIDATION_ERRORS.REST_INVALID_JSON
      );
    });

    it('should fail early when REST data is not an object', () => {
      expect(() => restParserService.parseRESTDataUsage('"not an object"')).toThrow(
        VALIDATION_ERRORS.REST_INVALID_OBJECT
      );
    });

    it('should fail early when REST data is null', () => {
      expect(() => restParserService.parseRESTDataUsage('null')).toThrow(
        VALIDATION_ERRORS.REST_INVALID_OBJECT
      );
    });

    it('should fail early when REST data is an array', () => {
      expect(() => restParserService.parseRESTDataUsage('[]')).toThrow(
        VALIDATION_ERRORS.REST_INVALID_OBJECT
      );
    });
  });
});
