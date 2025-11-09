import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ValidationService {
  isNonEmptyString(value: unknown): boolean {
    return typeof value === 'string' && value.trim().length > 0;
  }

  isNonNegative(value: number): boolean {
    return value >= 0;
  }
}
