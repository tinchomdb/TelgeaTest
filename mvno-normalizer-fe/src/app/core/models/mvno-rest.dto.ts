export interface MVNORestResponse {
  user_id: string;
  msisdn: string;
  usage: RestUsage;
  network: RestNetwork;
}

export interface RestUsage {
  data: RestUsageData;
  period: RestUsagePeriod;
}

export interface RestUsageData {
  total_mb: number;
  roaming_mb?: number;
  country?: string;
}

export interface RestUsagePeriod {
  start: string;
  end: string;
}

export interface RestNetwork {
  type: string;
  provider_code: string;
}
