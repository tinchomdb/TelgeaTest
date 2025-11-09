import { XMLParser } from "fast-xml-parser";
import { SOAPChargeSMS } from "../types/mvno-soap.types";
import { RawData } from "../types/common.types";

/**
 * Service for parsing SOAP XML responses
 */
export class XMLParserService {
  private parser: XMLParser;

  constructor() {
    this.parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
    });
  }

  /**
   * Parse SOAP XML and extract charge SMS data
   * @param xmlString Raw SOAP XML string
   * @returns Parsed SMS charge data
   * @throws Error if XML structure is invalid
   */
  parseSOAPCharge(xmlString: string): SOAPChargeSMS {
    try {
      const parsed = this.parser.parse(xmlString) as RawData;

      // Navigate through the SOAP envelope structure
      const envelope = parsed["soapenv:Envelope"] as RawData;
      if (!envelope) {
        throw new Error("Missing soapenv:Envelope in SOAP response");
      }

      const body = envelope["soapenv:Body"] as RawData;
      if (!body) {
        throw new Error("Missing soapenv:Body in SOAP response");
      }

      const chargeSMSRaw = body["sms:ChargeSMS"] as RawData;
      if (!chargeSMSRaw) {
        throw new Error("Missing sms:ChargeSMS in SOAP response body");
      }

      // Extract and validate required fields
      const requiredFields = {
        UserID: chargeSMSRaw["sms:UserID"],
        PhoneNumber: chargeSMSRaw["sms:PhoneNumber"],
        MessageID: chargeSMSRaw["sms:MessageID"],
        Timestamp: chargeSMSRaw["sms:Timestamp"],
        ChargeAmount: chargeSMSRaw["sms:ChargeAmount"],
        Currency: chargeSMSRaw["sms:Currency"],
      };

      // Validate all required fields are present
      for (const [fieldName, fieldValue] of Object.entries(requiredFields)) {
        if (
          fieldValue === undefined ||
          fieldValue === null ||
          fieldValue === ""
        ) {
          throw new Error(`Missing required field: ${fieldName}`);
        }
      }

      // Return typed object with validated data
      return {
        UserID: requiredFields.UserID as string,
        PhoneNumber: String(requiredFields.PhoneNumber),
        MessageID: requiredFields.MessageID as string,
        Timestamp: requiredFields.Timestamp as string,
        ChargeAmount: requiredFields.ChargeAmount as string | number,
        Currency: requiredFields.Currency as string,
      };
    } catch (error) {
      throw new Error(
        `Failed to parse SOAP XML: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
}
