import { TestBed } from '@angular/core/testing';
import { NormalizerService } from './normalizer.service';
import { XmlParserService } from './xml-parser.service';
import { RestParserService } from './rest-parser.service';

describe('NormalizerService Integration Tests', () => {
  let normalizerService: NormalizerService;
  let xmlParserService: XmlParserService;
  let restParserService: RestParserService;

  const VALID_SOAP_XML = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sms="http://provider.com/sms">
      <soapenv:Header/>
      <soapenv:Body>
        <sms:ChargeSMS>
          <sms:UserID>abc123</sms:UserID>
          <sms:PhoneNumber>+46701234567</sms:PhoneNumber>
          <sms:MessageID>msg789</sms:MessageID>
          <sms:Timestamp>2025-04-01T12:30:00Z</sms:Timestamp>
          <sms:ChargeAmount>0.05</sms:ChargeAmount>
          <sms:Currency>EUR</sms:Currency>
        </sms:ChargeSMS>
      </soapenv:Body>
    </soapenv:Envelope>
  `;

  const VALID_REST_JSON = {
    user_id: 'abc123',
    msisdn: '+46701234567',
    usage: {
      data: {
        total_mb: 845.23,
        roaming_mb: 210.5,
        country: 'SE',
      },
      period: {
        start: '2025-04-01T00:00:00Z',
        end: '2025-04-30T23:59:59Z',
      },
    },
    network: {
      type: '4G',
      provider_code: 'SE01',
    },
  };

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

      expect(normalized).toEqual({
        telgea_user_id: 'abc123',
        msisdn: '+46701234567',
        sms_charges: [
          {
            message_id: 'msg789',
            timestamp: '2025-04-01T12:30:00Z',
            amount: 0.05,
            currency: 'EUR',
          },
        ],
        billing_period: {
          start: '2025-04-01T12:30:00Z',
          end: '2025-04-01T12:30:00Z',
        },
      });
    });

    it('should throw error when UserID is missing', () => {
      const invalidXml = `
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sms="http://provider.com/sms">
          <soapenv:Body>
            <sms:ChargeSMS>
              <sms:PhoneNumber>+46701234567</sms:PhoneNumber>
              <sms:MessageID>msg789</sms:MessageID>
              <sms:Timestamp>2025-04-01T12:30:00Z</sms:Timestamp>
              <sms:ChargeAmount>0.05</sms:ChargeAmount>
              <sms:Currency>EUR</sms:Currency>
            </sms:ChargeSMS>
          </soapenv:Body>
        </soapenv:Envelope>
      `;

      expect(() => xmlParserService.parseSOAPCharge(invalidXml)).toThrow(
        'Missing required SOAP field: UserID'
      );
    });

    it('should throw error when PhoneNumber is missing', () => {
      const invalidXml = `
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sms="http://provider.com/sms">
          <soapenv:Body>
            <sms:ChargeSMS>
              <sms:UserID>abc123</sms:UserID>
              <sms:MessageID>msg789</sms:MessageID>
              <sms:Timestamp>2025-04-01T12:30:00Z</sms:Timestamp>
              <sms:ChargeAmount>0.05</sms:ChargeAmount>
              <sms:Currency>EUR</sms:Currency>
            </sms:ChargeSMS>
          </soapenv:Body>
        </soapenv:Envelope>
      `;

      expect(() => xmlParserService.parseSOAPCharge(invalidXml)).toThrow(
        'Missing required SOAP field: PhoneNumber'
      );
    });

    it('should throw error when ChargeAmount is invalid', () => {
      const invalidXml = `
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sms="http://provider.com/sms">
          <soapenv:Body>
            <sms:ChargeSMS>
              <sms:UserID>abc123</sms:UserID>
              <sms:PhoneNumber>+46701234567</sms:PhoneNumber>
              <sms:MessageID>msg789</sms:MessageID>
              <sms:Timestamp>2025-04-01T12:30:00Z</sms:Timestamp>
              <sms:ChargeAmount>invalid</sms:ChargeAmount>
              <sms:Currency>EUR</sms:Currency>
            </sms:ChargeSMS>
          </soapenv:Body>
        </soapenv:Envelope>
      `;

      expect(() => xmlParserService.parseSOAPCharge(invalidXml)).toThrow(
        'Invalid charge amount format'
      );
    });

    it('should throw error when ChargeAmount is negative', () => {
      const invalidXml = `
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sms="http://provider.com/sms">
          <soapenv:Body>
            <sms:ChargeSMS>
              <sms:UserID>abc123</sms:UserID>
              <sms:PhoneNumber>+46701234567</sms:PhoneNumber>
              <sms:MessageID>msg789</sms:MessageID>
              <sms:Timestamp>2025-04-01T12:30:00Z</sms:Timestamp>
              <sms:ChargeAmount>-0.05</sms:ChargeAmount>
              <sms:Currency>EUR</sms:Currency>
            </sms:ChargeSMS>
          </soapenv:Body>
        </soapenv:Envelope>
      `;

      expect(() => xmlParserService.parseSOAPCharge(invalidXml)).toThrow(
        'Charge amount cannot be negative'
      );
    });

    it('should throw error when XML is malformed', () => {
      const malformedXml = '<invalid>xml</notclosed>';

      expect(() => xmlParserService.parseSOAPCharge(malformedXml)).toThrow('Invalid XML format');
    });
  });

  describe('REST Normalization', () => {
    it('should correctly normalize valid REST JSON', () => {
      const validatedRest = restParserService.validateRESTDataUsage(VALID_REST_JSON);
      const normalized = normalizerService.normalizeRESTDataUsage(validatedRest);

      expect(normalized).toEqual({
        telgea_user_id: 'abc123',
        msisdn: '+46701234567',
        usage_data: {
          total_mb: 845.23,
          roaming_mb: 210.5,
          country: 'SE',
          network_type: '4G',
          provider_code: 'SE01',
        },
        billing_period: {
          start: '2025-04-01T00:00:00Z',
          end: '2025-04-30T23:59:59Z',
        },
      });
    });

    it('should throw error when user_id is missing', () => {
      const invalidJson = { ...VALID_REST_JSON };
      delete (invalidJson as any).user_id;

      expect(() => restParserService.validateRESTDataUsage(invalidJson)).toThrow(
        'Invalid REST response structure: missing required fields (user_id, msisdn, usage, network)'
      );
    });

    it('should throw error when msisdn is missing', () => {
      const invalidJson = { ...VALID_REST_JSON };
      delete (invalidJson as any).msisdn;

      expect(() => restParserService.validateRESTDataUsage(invalidJson)).toThrow(
        'Invalid REST response structure: missing required fields (user_id, msisdn, usage, network)'
      );
    });

    it('should throw error when user_id is empty string', () => {
      const invalidJson = { ...VALID_REST_JSON, user_id: '' };

      expect(() => restParserService.validateRESTDataUsage(invalidJson)).toThrow(
        'Invalid REST response structure: missing required fields (user_id, msisdn, usage, network)'
      );
    });

    it('should throw error when usage is missing', () => {
      const invalidJson = { ...VALID_REST_JSON };
      delete (invalidJson as any).usage;

      expect(() => restParserService.validateRESTDataUsage(invalidJson)).toThrow(
        'Invalid REST response structure: missing required fields (user_id, msisdn, usage, network)'
      );
    });

    it('should throw error when network is missing', () => {
      const invalidJson = { ...VALID_REST_JSON };
      delete (invalidJson as any).network;

      expect(() => restParserService.validateRESTDataUsage(invalidJson)).toThrow(
        'Invalid REST response structure: missing required fields (user_id, msisdn, usage, network)'
      );
    });

    it('should throw error when data is not an object', () => {
      const invalidJson = 'not an object';

      expect(() => restParserService.validateRESTDataUsage(invalidJson)).toThrow(
        'Invalid REST response structure: missing required fields (user_id, msisdn, usage, network)'
      );
    });

    it('should throw error when data is null', () => {
      expect(() => restParserService.validateRESTDataUsage(null)).toThrow(
        'Invalid REST response structure: missing required fields (user_id, msisdn, usage, network)'
      );
    });

    it('should throw error when data is an array', () => {
      expect(() => restParserService.validateRESTDataUsage([])).toThrow(
        'Invalid REST response structure: missing required fields (user_id, msisdn, usage, network)'
      );
    });
  });

  describe('Combined Data Normalization', () => {
    it('should produce expected structure matching internal_api_format.json when combining both sources', () => {
      const parsedSoap = xmlParserService.parseSOAPCharge(VALID_SOAP_XML);
      const soapNormalized = normalizerService.normalizeSOAPChargeSMS(parsedSoap);

      const validatedRest = restParserService.validateRESTDataUsage(VALID_REST_JSON);
      const restNormalized = normalizerService.normalizeRESTDataUsage(validatedRest);

      const combined = {
        telgea_user_id: restNormalized.telgea_user_id,
        msisdn: restNormalized.msisdn,
        usage_data: restNormalized.usage_data,
        sms_charges: soapNormalized.sms_charges,
        billing_period: restNormalized.billing_period,
      };

      expect(combined).toEqual({
        telgea_user_id: 'abc123',
        msisdn: '+46701234567',
        usage_data: {
          total_mb: 845.23,
          roaming_mb: 210.5,
          country: 'SE',
          network_type: '4G',
          provider_code: 'SE01',
        },
        sms_charges: [
          {
            message_id: 'msg789',
            timestamp: '2025-04-01T12:30:00Z',
            amount: 0.05,
            currency: 'EUR',
          },
        ],
        billing_period: {
          start: '2025-04-01T00:00:00Z',
          end: '2025-04-30T23:59:59Z',
        },
      });
    });
  });
});
