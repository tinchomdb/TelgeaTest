import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ValidationService {
  isNonEmptyString(value: unknown): boolean {
    return typeof value === 'string' && value.trim().length > 0;
  }

  isValidNumber(value: string | null | undefined): boolean {
    if (!value) return false;
    const num = parseFloat(value);
    return !isNaN(num);
  }

  isNonNegative(value: number): boolean {
    return value >= 0;
  }
}
