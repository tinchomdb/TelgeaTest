import { Injectable, inject } from '@angular/core';
import { MVNORestResponse } from '../models/mvno-rest.dto';
import { ValidationService } from './validation.service';
import { VALIDATION_ERRORS } from '../constants/validation-errors';

@Injectable({
  providedIn: 'root',
})
export class RestParserService {
  private validator = inject(ValidationService);

  validateRESTDataUsage(data: unknown): MVNORestResponse {
    if (!this.isObject(data)) {
      throw new Error(VALIDATION_ERRORS.REST_INVALID_OBJECT);
    }

    const obj = data as Record<string, unknown>;

    if (!this.validator.isNonEmptyString(obj['user_id'])) {
      throw new Error(VALIDATION_ERRORS.REST_MISSING_USER_ID);
    }

    if (!this.validator.isNonEmptyString(obj['msisdn'])) {
      throw new Error(VALIDATION_ERRORS.REST_MISSING_MSISDN);
    }

    if (!this.isValidUsageObject(obj['usage'])) {
      throw new Error(VALIDATION_ERRORS.REST_MISSING_USAGE);
    }

    if (!this.isValidNetworkObject(obj['network'])) {
      throw new Error(VALIDATION_ERRORS.REST_MISSING_NETWORK);
    }

    return data as MVNORestResponse;
  }

  private isObject(data: unknown): data is object {
    return data !== null && typeof data === 'object' && !Array.isArray(data);
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
