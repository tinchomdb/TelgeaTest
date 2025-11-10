/**
 * Test data for XML Parser Service tests
 * Contains various XML scenarios including valid, invalid, and edge cases
 * Uses a builder pattern to reduce repetition
 */

import {
  TEST_USER_ID,
  TEST_PHONE_WITH_PLUS,
  TEST_MESSAGE_ID,
  TEST_TIMESTAMP,
  TEST_AMOUNTS,
  TEST_CURRENCY,
} from './test-constants';

// XML Building helpers
const XML_DECLARATION = '<?xml version="1.0" encoding="UTF-8"?>';

interface XmlChargeRequestFields {
  userId?: string;
  phoneNumber?: string;
  messageId?: string;
  timestamp?: string;
  chargeAmount?: string;
  currency?: string;
}

/**
 * Builds a SOAP XML string with optional fields
 * Omitted fields will not be included in the XML
 */
function buildSoapXml(fields: XmlChargeRequestFields, includeDeclaration = true): string {
  const declaration = includeDeclaration ? XML_DECLARATION : '';
  const { userId, phoneNumber, messageId, timestamp, chargeAmount, currency } = fields;

  return `${declaration}
  <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
      <ChargeRequest>
        ${userId !== undefined ? `<UserID>${userId}</UserID>` : ''}
        ${phoneNumber !== undefined ? `<PhoneNumber>${phoneNumber}</PhoneNumber>` : ''}
        ${messageId !== undefined ? `<MessageID>${messageId}</MessageID>` : ''}
        ${timestamp !== undefined ? `<Timestamp>${timestamp}</Timestamp>` : ''}
        ${chargeAmount !== undefined ? `<ChargeAmount>${chargeAmount}</ChargeAmount>` : ''}
        ${currency !== undefined ? `<Currency>${currency}</Currency>` : ''}
      </ChargeRequest>
    </soap:Body>
  </soap:Envelope>
`;
}

// Base valid fields
const VALID_FIELDS: XmlChargeRequestFields = {
  userId: TEST_USER_ID,
  phoneNumber: TEST_PHONE_WITH_PLUS,
  messageId: TEST_MESSAGE_ID,
  timestamp: TEST_TIMESTAMP,
  chargeAmount: `${TEST_AMOUNTS.POSITIVE}`,
  currency: TEST_CURRENCY,
};

// Valid XML variations
export const XML_PARSER_VALID = buildSoapXml(VALID_FIELDS, false);

export const XML_PARSER_WITH_NAMESPACE = `
  <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sms="http://example.com/sms">
    <soap:Body>
      <ChargeRequest>
        <sms:UserID>${TEST_USER_ID}</sms:UserID>
        <sms:PhoneNumber>${TEST_PHONE_WITH_PLUS}</sms:PhoneNumber>
        <sms:MessageID>${TEST_MESSAGE_ID}</sms:MessageID>
        <sms:Timestamp>${TEST_TIMESTAMP}</sms:Timestamp>
        <sms:ChargeAmount>${TEST_AMOUNTS.POSITIVE}</sms:ChargeAmount>
        <sms:Currency>${TEST_CURRENCY}</sms:Currency>
      </ChargeRequest>
    </soap:Body>
  </soap:Envelope>
`;

export const XML_PARSER_MALFORMED = '<invalid><xml>';

// Missing field variations
export const XML_PARSER_MISSING_USER_ID = buildSoapXml({
  ...VALID_FIELDS,
  userId: undefined,
});

export const XML_PARSER_MISSING_PHONE = buildSoapXml({
  ...VALID_FIELDS,
  phoneNumber: undefined,
});

export const XML_PARSER_MISSING_MESSAGE_ID = buildSoapXml({
  ...VALID_FIELDS,
  messageId: undefined,
});

export const XML_PARSER_MISSING_TIMESTAMP = buildSoapXml({
  ...VALID_FIELDS,
  timestamp: undefined,
});

export const XML_PARSER_MISSING_AMOUNT = buildSoapXml({
  ...VALID_FIELDS,
  chargeAmount: undefined,
});

export const XML_PARSER_MISSING_CURRENCY = buildSoapXml({
  ...VALID_FIELDS,
  currency: undefined,
});

// Invalid field variations
export const XML_PARSER_INVALID_AMOUNT = buildSoapXml({
  ...VALID_FIELDS,
  chargeAmount: 'invalid',
});

export const XML_PARSER_NEGATIVE_AMOUNT = buildSoapXml({
  ...VALID_FIELDS,
  chargeAmount: `${TEST_AMOUNTS.NEGATIVE}`,
});

export const XML_PARSER_ZERO_AMOUNT = buildSoapXml({
  ...VALID_FIELDS,
  chargeAmount: `${TEST_AMOUNTS.ZERO}`,
});

// Edge case variations
export const XML_PARSER_WITH_WHITESPACE = buildSoapXml({
  userId: `  ${TEST_USER_ID}  `,
  phoneNumber: `  ${TEST_PHONE_WITH_PLUS}  `,
  messageId: `  ${TEST_MESSAGE_ID}  `,
  timestamp: `  ${TEST_TIMESTAMP}  `,
  chargeAmount: `  ${TEST_AMOUNTS.POSITIVE}  `,
  currency: `  ${TEST_CURRENCY}  `,
});

export const XML_PARSER_EMPTY_USER_ID = buildSoapXml({
  ...VALID_FIELDS,
  userId: '   ',
});

export const XML_PARSER_DECIMAL_AMOUNT = buildSoapXml({
  ...VALID_FIELDS,
  chargeAmount: `${TEST_AMOUNTS.POSITIVE}`,
});
