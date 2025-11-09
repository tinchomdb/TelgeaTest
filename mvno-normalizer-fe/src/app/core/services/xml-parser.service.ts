import { Injectable, inject } from '@angular/core';
import { ParsedSoapData } from '../models/mvno-soap.dto';
import { ValidationService } from './validation.service';
import { VALIDATION_ERRORS } from '../constants/validation-errors';

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
        throw new Error(VALIDATION_ERRORS.SOAP_INVALID_XML);
      }

      const userId = this.getElementText(xmlDoc, 'UserID');
      const phoneNumber = this.getElementText(xmlDoc, 'PhoneNumber');
      const messageId = this.getElementText(xmlDoc, 'MessageID');
      const timestamp = this.getElementText(xmlDoc, 'Timestamp');
      const chargeAmountStr = this.getElementText(xmlDoc, 'ChargeAmount');
      const currency = this.getElementText(xmlDoc, 'Currency');

      if (!this.validator.isNonEmptyString(userId))
        throw new Error(VALIDATION_ERRORS.SOAP_MISSING_USER_ID);
      if (!this.validator.isNonEmptyString(phoneNumber))
        throw new Error(VALIDATION_ERRORS.SOAP_MISSING_PHONE);
      if (!this.validator.isNonEmptyString(messageId))
        throw new Error(VALIDATION_ERRORS.SOAP_MISSING_MESSAGE_ID);
      if (!this.validator.isNonEmptyString(timestamp))
        throw new Error(VALIDATION_ERRORS.SOAP_MISSING_TIMESTAMP);
      if (!this.validator.isNonEmptyString(chargeAmountStr))
        throw new Error(VALIDATION_ERRORS.SOAP_MISSING_AMOUNT);
      if (!this.validator.isNonEmptyString(currency))
        throw new Error(VALIDATION_ERRORS.SOAP_MISSING_CURRENCY);

      const chargeAmount = parseFloat(chargeAmountStr!);
      if (isNaN(chargeAmount)) {
        throw new Error(VALIDATION_ERRORS.SOAP_INVALID_AMOUNT_FORMAT);
      }

      if (!this.validator.isNonNegative(chargeAmount)) {
        throw new Error(VALIDATION_ERRORS.SOAP_NEGATIVE_AMOUNT);
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
