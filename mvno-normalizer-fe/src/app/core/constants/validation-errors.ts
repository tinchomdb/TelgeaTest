export const VALIDATION_ERRORS = {
  // REST validation errors
  REST_INVALID_JSON: 'Invalid JSON format',
  REST_INVALID_OBJECT: 'Invalid REST response: data must be an object',
  REST_MISSING_USER_ID: 'Missing or invalid required field: user_id',
  REST_MISSING_MSISDN: 'Missing or invalid required field: msisdn',
  REST_MISSING_USAGE: 'Missing or invalid required field: usage',
  REST_MISSING_NETWORK: 'Missing or invalid required field: network',

  // SOAP validation errors
  SOAP_INVALID_XML: 'Invalid XML format',
  SOAP_MISSING_USER_ID: 'Missing required SOAP field: UserID',
  SOAP_MISSING_PHONE: 'Missing required SOAP field: PhoneNumber',
  SOAP_MISSING_MESSAGE_ID: 'Missing required SOAP field: MessageID',
  SOAP_MISSING_TIMESTAMP: 'Missing required SOAP field: Timestamp',
  SOAP_MISSING_AMOUNT: 'Missing required SOAP field: ChargeAmount',
  SOAP_MISSING_CURRENCY: 'Missing required SOAP field: Currency',
  SOAP_INVALID_AMOUNT_FORMAT: 'Invalid charge amount format',
  SOAP_NEGATIVE_AMOUNT: 'Charge amount cannot be negative',
} as const;
