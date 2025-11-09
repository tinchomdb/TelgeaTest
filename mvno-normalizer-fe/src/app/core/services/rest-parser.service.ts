import { Injectable, inject } from '@angular/core';
import { MVNORestResponse } from '../models/mvno-rest.dto';
import { ValidationService } from './validation.service';

@Injectable({
  providedIn: 'root',
})
export class RestParserService {
  private validator = inject(ValidationService);

  validateRESTDataUsage(data: unknown): MVNORestResponse {
    if (!this.isValidRESTDataResponse(data)) {
      throw new Error(
        'Invalid REST response structure: missing required fields (user_id, msisdn, usage, network)'
      );
    }
    return data as MVNORestResponse;
  }

  private isValidRESTDataResponse(data: unknown): data is MVNORestResponse {
    if (!this.isObject(data)) return false;

    const obj = data as Record<string, unknown>;

    if (!this.hasRequiredTopLevelFields(obj)) return false;
    if (!this.isValidUsageObject(obj['usage'])) return false;
    if (!this.isValidNetworkObject(obj['network'])) return false;

    return true;
  }

  private isObject(data: unknown): data is object {
    return data !== null && typeof data === 'object' && !Array.isArray(data);
  }

  private hasRequiredTopLevelFields(obj: Record<string, unknown>): boolean {
    const userId = obj['user_id'];
    const msisdn = obj['msisdn'];

    if (!this.validator.isNonEmptyString(userId)) return false;
    if (!this.validator.isNonEmptyString(msisdn)) return false;

    return true;
  }

  private isValidUsageObject(usage: unknown): boolean {
    if (!this.isObject(usage)) return false;
    const usageObj = usage as Record<string, unknown>;
    return this.isObject(usageObj['data']) && this.isObject(usageObj['period']);
  }

  private isValidNetworkObject(network: unknown): boolean {
    if (!this.isObject(network)) return false;
    const networkObj = network as Record<string, unknown>;
    return (
      typeof networkObj['type'] === 'string' && typeof networkObj['provider_code'] === 'string'
    );
  }
}
