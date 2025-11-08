export interface MVNORESTDataResponse {
  user_id: string;
  msisdn: string;
  usage: RESTUsage;
  network: RESTNetwork;
}

export interface RESTUsage {
  data: RESTUsageData;
  period: RESTUsagePeriod;
}

export interface RESTUsageData {
  total_mb: number;
  roaming_mb?: number;
  country?: string;
}

export interface RESTUsagePeriod {
  start: string;
  end: string;
}

export interface RESTNetwork {
  type: string;
  provider_code: string;
}
