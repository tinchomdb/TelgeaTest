import { Injectable } from '@angular/core';
import { TelgeaInternalFormat } from '../models/telgea-internal.model';
import { ParsedSoapData } from '../models/mvno-soap.dto';
import { MVNORestResponse } from '../models/mvno-rest.dto';

@Injectable({
  providedIn: 'root',
})
export class NormalizerService {
  normalizeSOAPChargeSMS(soapData: ParsedSoapData): TelgeaInternalFormat {
    return {
      telgea_user_id: soapData.userId,
      msisdn: soapData.phoneNumber,
      sms_charges: [
        {
          message_id: soapData.messageId,
          timestamp: soapData.timestamp,
          amount: soapData.chargeAmount,
          currency: soapData.currency,
        },
      ],
      billing_period: {
        start: soapData.timestamp,
        end: soapData.timestamp,
      },
    };
  }

  normalizeRESTDataUsage(restData: MVNORestResponse): TelgeaInternalFormat {
    return {
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
  }
}
