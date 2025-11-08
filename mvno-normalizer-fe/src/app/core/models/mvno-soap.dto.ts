export interface SoapChargeSMS {
  UserID: string;
  PhoneNumber: string;
  MessageID: string;
  Timestamp: string;
  ChargeAmount: string | number;
  Currency: string;
}

export interface SoapEnvelope {
  'soapenv:Envelope': {
    'soapenv:Body': {
      'sms:ChargeSMS': SoapChargeSMS;
    };
  };
}

export interface ParsedSoapData {
  userId: string;
  phoneNumber: string;
  messageId: string;
  timestamp: string;
  chargeAmount: number;
  currency: string;
}
