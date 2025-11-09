export const VALID_SOAP_XML = `
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

export const SOAP_XML_MISSING_USER_ID = `
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

export const SOAP_XML_MISSING_PHONE = `
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

export const SOAP_XML_INVALID_AMOUNT = `
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

export const SOAP_XML_NEGATIVE_AMOUNT = `
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

export const SOAP_XML_MALFORMED = '<invalid>xml</notclosed>';

export const VALID_REST_JSON = {
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

export const EXPECTED_SOAP_NORMALIZED = {
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
};

export const EXPECTED_REST_NORMALIZED = {
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
};
