export interface SOAPChargeSMS {
  UserID: string;
  PhoneNumber: string;
  MessageID: string;
  Timestamp: string;
  ChargeAmount: string | number;
  Currency: string;
}

export interface SOAPEnvelope {
  "soapenv:Envelope": {
    "soapenv:Body": {
      "sms:ChargeSMS": SOAPChargeSMS;
    };
  };
}
