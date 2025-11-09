import { MVNORESTDataResponse } from "../types/mvno-rest.types";
import { RawData } from "../types/common.types";

/**
 * Service for parsing and validating REST JSON responses
 */
export class RESTParserService {
  /**
   * Validate REST JSON response structure
   * @param data Raw data from HTTP request body
   * @returns Validated MVNO REST response
   * @throws Error if data structure is invalid
   */
  validateRESTDataUsage(data: RawData): MVNORESTDataResponse {
    if (!this.isValidRESTDataResponse(data)) {
      throw new Error(
        "Invalid REST response structure: missing required fields"
      );
    }
    return data as MVNORESTDataResponse;
  }

  /**
   * Type guard to validate REST response has required structure
   */
  private isValidRESTDataResponse(data: unknown): data is MVNORESTDataResponse {
    if (!this.isObject(data)) return false;

    const obj = data as RawData;

    if (!this.hasRequiredTopLevelFields(obj)) return false;
    if (!this.isValidUsageObject(obj.usage)) return false;
    if (!this.isValidNetworkObject(obj.network)) return false;

    return true;
  }

  private isObject(data: unknown): data is object {
    return data !== null && typeof data === "object" && !Array.isArray(data);
  }

  private hasRequiredTopLevelFields(obj: RawData): boolean {
    return typeof obj.user_id === "string" && typeof obj.msisdn === "string";
  }

  private isValidUsageObject(usage: unknown): boolean {
    if (!this.isObject(usage)) return false;
    const usageObj = usage as RawData;
    return this.isObject(usageObj.data) && this.isObject(usageObj.period);
  }

  private isValidNetworkObject(network: unknown): boolean {
    if (!this.isObject(network)) return false;
    const networkObj = network as RawData;
    return (
      typeof networkObj.type === "string" &&
      typeof networkObj.provider_code === "string"
    );
  }
}
