import { Injectable, inject } from '@angular/core';
import { ParsedSoapData } from '../models/mvno-soap.dto';
import { ValidationService } from './validation.service';

@Injectable({
  providedIn: 'root',
})
export class XmlParserService {
  private validator = inject(ValidationService);

  parseSOAPCharge(xmlString: string): ParsedSoapData {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

      const parserError = xmlDoc.querySelector('parsererror');
      if (parserError) {
        throw new Error('Invalid XML format');
      }

      const userId = this.getElementText(xmlDoc, 'UserID');
      const phoneNumber = this.getElementText(xmlDoc, 'PhoneNumber');
      const messageId = this.getElementText(xmlDoc, 'MessageID');
      const timestamp = this.getElementText(xmlDoc, 'Timestamp');
      const chargeAmountStr = this.getElementText(xmlDoc, 'ChargeAmount');
      const currency = this.getElementText(xmlDoc, 'Currency');

      if (!this.validator.isNonEmptyString(userId))
        throw new Error('Missing required SOAP field: UserID');
      if (!this.validator.isNonEmptyString(phoneNumber))
        throw new Error('Missing required SOAP field: PhoneNumber');
      if (!this.validator.isNonEmptyString(messageId))
        throw new Error('Missing required SOAP field: MessageID');
      if (!this.validator.isNonEmptyString(timestamp))
        throw new Error('Missing required SOAP field: Timestamp');
      if (!this.validator.isNonEmptyString(chargeAmountStr))
        throw new Error('Missing required SOAP field: ChargeAmount');
      if (!this.validator.isNonEmptyString(currency))
        throw new Error('Missing required SOAP field: Currency');

      const chargeAmount = parseFloat(chargeAmountStr!);
      if (isNaN(chargeAmount)) {
        throw new Error('Invalid charge amount format');
      }

      if (!this.validator.isNonNegative(chargeAmount)) {
        throw new Error('Charge amount cannot be negative');
      }

      return {
        userId: userId!,
        phoneNumber: phoneNumber!,
        messageId: messageId!,
        timestamp: timestamp!,
        chargeAmount,
        currency: currency!,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Failed to parse SOAP XML: ${String(error)}`);
    }
  }

  private getElementText(xmlDoc: Document, tagName: string): string | null {
    const element =
      xmlDoc.getElementsByTagName(tagName)[0] || xmlDoc.getElementsByTagName(`sms:${tagName}`)[0];
    return element?.textContent?.trim() || null;
  }
}
