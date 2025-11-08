import { MVNORESTDataResponse } from "../types/mvno-rest.types";
import { SOAPChargeSMS } from "../types/mvno-soap.types";
import { NormalizerService } from "./normalizer.service";

describe("NormalizerService", () => {
  const normalizer = new NormalizerService();

  describe("normalizeSOAPChargeSMS", () => {
    it("should normalize SOAP SMS charge data to Telgea internal format", () => {
      // Arrange
      const soapCharge: SOAPChargeSMS = {
        UserID: "USER123",
        PhoneNumber: "34912345678",
        MessageID: "MSG-001",
        ChargeAmount: "0.15",
        Currency: "EUR",
        Timestamp: "2025-11-06T15:30:45Z",
      };

      // Act
      const result = normalizer.normalizeSOAPChargeSMS(soapCharge);

      // Assert
      expect(result.telgea_user_id).toBe("USER123");
      expect(result.msisdn).toBe("34912345678");
      expect(result.sms_charges).toHaveLength(1);
      expect(result.sms_charges?.[0].amount).toBe(0.15);
      expect(result.sms_charges?.[0].currency).toBe("EUR");
      expect(result.billing_period.start).toBe("2025-11-06T15:30:45Z");
      expect(result.billing_period.end).toBe("2025-11-06T15:30:45Z");
    });
  });

  describe("normalizeRESTDataUsage", () => {
    it("should normalize REST usage data to Telgea internal format", () => {
      // Arrange
      const restData: MVNORESTDataResponse = {
        user_id: "USER456",
        msisdn: "34987654321",
        usage: {
          data: {
            total_mb: 2500,
            roaming_mb: 100,
            country: "ES",
          },
          period: {
            start: "2025-11-01",
            end: "2025-11-30",
          },
        },
        network: {
          type: "4G",
          provider_code: "TEL",
        },
      };

      // Act
      const result = normalizer.normalizeRESTDataUsage(restData);

      // Assert
      expect(result.telgea_user_id).toBe("USER456");
      expect(result.msisdn).toBe("34987654321");
      expect(result.usage_data?.total_mb).toBe(2500);
      expect(result.usage_data?.roaming_mb).toBe(100);
      expect(result.billing_period.start).toBe("2025-11-01");
      expect(result.billing_period.end).toBe("2025-11-30");
    });
  });
});
