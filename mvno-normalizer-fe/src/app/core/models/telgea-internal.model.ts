export interface TelgeaInternalFormat {
  telgea_user_id: string;
  msisdn: string;
  usage_data?: UsageData;
  sms_charges?: SMSCharge[];
  billing_period: BillingPeriod;
}

export interface UsageData {
  total_mb: number;
  roaming_mb?: number;
  country?: string;
  network_type?: string;
  provider_code?: string;
}

export interface SMSCharge {
  message_id: string;
  timestamp: string;
  amount: number;
  currency: string;
}

export interface BillingPeriod {
  start: string;
  end: string;
}

export interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}
