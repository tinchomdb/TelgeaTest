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

      const chargeSMS = body["sms:ChargeSMS"] as SOAPChargeSMS;
      if (!chargeSMS) {
        throw new Error("Missing sms:ChargeSMS in SOAP response body");
      }

      return chargeSMS;
    } catch (error) {
      throw new Error(
        `Failed to parse SOAP XML: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
}
