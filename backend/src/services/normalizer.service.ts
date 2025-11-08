import { TelgeaInternalFormat } from "../types/telgea-internal.types";
import { SOAPChargeSMS } from "../types/mvno-soap.types";
import { MVNORESTDataResponse } from "../types/mvno-rest.types";

export class NormalizerService {
  /**
   * Normalize SOAP SMS charge data to Telgea format
   * @param soapCharge Parsed SOAP charge data
   * @returns Normalized Telgea format
   */
  normalizeSOAPChargeSMS(soapCharge: SOAPChargeSMS): TelgeaInternalFormat {
    const chargeAmount =
      typeof soapCharge.ChargeAmount === "string"
        ? parseFloat(soapCharge.ChargeAmount)
        : soapCharge.ChargeAmount;

    return {
      telgea_user_id: soapCharge.UserID,
      msisdn: soapCharge.PhoneNumber,
      sms_charges: [
        {
          message_id: soapCharge.MessageID,
          timestamp: soapCharge.Timestamp,
          amount: chargeAmount,
          currency: soapCharge.Currency,
        },
      ],
      // For SOAP, we'll use the charge timestamp as billing period
      // In a real scenario, this might come from a different source
      billing_period: {
        start: soapCharge.Timestamp,
        end: soapCharge.Timestamp,
      },
    };
  }

  /**
   * Normalize REST usage data to Telgea format
   * @param restData Parsed REST response
   * @returns Normalized Telgea format
   */
  normalizeRESTDataUsage(restData: MVNORESTDataResponse): TelgeaInternalFormat {
    const normalized: TelgeaInternalFormat = {
      telgea_user_id: restData.user_id,
      msisdn: restData.msisdn,
      usage_data: {
        total_mb: restData.usage.data.total_mb,
        roaming_mb: restData.usage.data.roaming_mb,
        country: restData.usage.data.country,
        network_type: restData.network.type,
        provider_code: restData.network.provider_code,
      },
      billing_period: {
        start: restData.usage.period.start,
        end: restData.usage.period.end,
      },
    };

    return normalized;
  }
}
