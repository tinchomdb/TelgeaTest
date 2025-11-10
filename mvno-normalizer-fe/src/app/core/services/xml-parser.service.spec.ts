import { TestBed } from '@angular/core/testing';
import { XmlParserService } from './xml-parser.service';
import { ValidationService } from './validation.service';
import { VALIDATION_ERRORS } from '../constants/validation-errors';
import * as TestData from './__fixtures__/xml-parser-test-data';
import {
  TEST_USER_ID,
  TEST_PHONE_WITH_PLUS,
  TEST_MESSAGE_ID,
  TEST_TIMESTAMP,
  TEST_AMOUNTS,
  TEST_CURRENCY,
} from './__fixtures__/test-constants';

describe('XmlParserService', () => {
  let service: XmlParserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [XmlParserService, ValidationService],
    });
    service = TestBed.inject(XmlParserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('parseSOAPCharge', () => {
    it('should parse valid SOAP XML successfully', () => {
      const result = service.parseSOAPCharge(TestData.XML_PARSER_VALID);

      expect(result.userId).toBe(TEST_USER_ID);
      expect(result.phoneNumber).toBe(TEST_PHONE_WITH_PLUS);
      expect(result.messageId).toBe(TEST_MESSAGE_ID);
      expect(result.timestamp).toBe(TEST_TIMESTAMP);
      expect(result.chargeAmount).toBe(TEST_AMOUNTS.POSITIVE);
      expect(result.currency).toBe(TEST_CURRENCY);
    });

    it('should parse SOAP XML with namespace prefix', () => {
      const result = service.parseSOAPCharge(TestData.XML_PARSER_WITH_NAMESPACE);

      expect(result.userId).toBe(TEST_USER_ID);
      expect(result.phoneNumber).toBe(TEST_PHONE_WITH_PLUS);
      expect(result.messageId).toBe(TEST_MESSAGE_ID);
      expect(result.timestamp).toBe(TEST_TIMESTAMP);
      expect(result.chargeAmount).toBe(TEST_AMOUNTS.POSITIVE);
      expect(result.currency).toBe(TEST_CURRENCY);
    });

    it('should throw error for malformed XML', () => {
      expect(() => service.parseSOAPCharge(TestData.XML_PARSER_MALFORMED)).toThrow(
        VALIDATION_ERRORS.SOAP_INVALID_XML
      );
    });

    it('should throw error when UserID is missing', () => {
      expect(() => service.parseSOAPCharge(TestData.XML_PARSER_MISSING_USER_ID)).toThrow(
        VALIDATION_ERRORS.SOAP_MISSING_USER_ID
      );
    });

    it('should throw error when PhoneNumber is missing', () => {
      expect(() => service.parseSOAPCharge(TestData.XML_PARSER_MISSING_PHONE)).toThrow(
        VALIDATION_ERRORS.SOAP_MISSING_PHONE
      );
    });

    it('should throw error when MessageID is missing', () => {
      expect(() => service.parseSOAPCharge(TestData.XML_PARSER_MISSING_MESSAGE_ID)).toThrow(
        VALIDATION_ERRORS.SOAP_MISSING_MESSAGE_ID
      );
    });

    it('should throw error when Timestamp is missing', () => {
      expect(() => service.parseSOAPCharge(TestData.XML_PARSER_MISSING_TIMESTAMP)).toThrow(
        VALIDATION_ERRORS.SOAP_MISSING_TIMESTAMP
      );
    });

    it('should throw error when ChargeAmount is missing', () => {
      expect(() => service.parseSOAPCharge(TestData.XML_PARSER_MISSING_AMOUNT)).toThrow(
        VALIDATION_ERRORS.SOAP_MISSING_AMOUNT
      );
    });

    it('should throw error when Currency is missing', () => {
      expect(() => service.parseSOAPCharge(TestData.XML_PARSER_MISSING_CURRENCY)).toThrow(
        VALIDATION_ERRORS.SOAP_MISSING_CURRENCY
      );
    });

    it('should throw error when ChargeAmount is not a valid number', () => {
      expect(() => service.parseSOAPCharge(TestData.XML_PARSER_INVALID_AMOUNT)).toThrow(
        VALIDATION_ERRORS.SOAP_INVALID_AMOUNT_FORMAT
      );
    });

    it('should throw error when ChargeAmount is negative', () => {
      expect(() => service.parseSOAPCharge(TestData.XML_PARSER_NEGATIVE_AMOUNT)).toThrow(
        VALIDATION_ERRORS.SOAP_NEGATIVE_AMOUNT
      );
    });

    it('should handle zero ChargeAmount', () => {
      const result = service.parseSOAPCharge(TestData.XML_PARSER_ZERO_AMOUNT);
      expect(result.chargeAmount).toBe(0);
    });

    it('should trim whitespace from text content', () => {
      const result = service.parseSOAPCharge(TestData.XML_PARSER_WITH_WHITESPACE);

      expect(result.userId).toBe(TEST_USER_ID);
      expect(result.phoneNumber).toBe(TEST_PHONE_WITH_PLUS);
      expect(result.messageId).toBe(TEST_MESSAGE_ID);
      expect(result.timestamp).toBe(TEST_TIMESTAMP);
      expect(result.chargeAmount).toBe(TEST_AMOUNTS.POSITIVE);
      expect(result.currency).toBe(TEST_CURRENCY);
    });

    it('should throw error when UserID is empty or whitespace', () => {
      expect(() => service.parseSOAPCharge(TestData.XML_PARSER_EMPTY_USER_ID)).toThrow(
        VALIDATION_ERRORS.SOAP_MISSING_USER_ID
      );
    });
  });
});
