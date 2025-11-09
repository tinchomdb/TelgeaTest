import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type MockScenario =
  | 'valid'
  | 'missing-userid'
  | 'missing-phone'
  | 'missing-usage'
  | 'invalid-amount'
  | 'invalid-structure'
  | 'empty-msisdn'
  | 'malformed';

export interface MockScenarioOption {
  value: MockScenario;
  label: string;
  description: string;
}

@Injectable({
  providedIn: 'root',
})
export class MockLoaderService {
  private http = inject(HttpClient);

  readonly soapScenarios: MockScenarioOption[] = [
    { value: 'valid', label: 'Valid', description: 'Complete valid SOAP charge' },
    { value: 'missing-userid', label: 'Missing UserID', description: 'UserID field not present' },
    {
      value: 'missing-phone',
      label: 'Missing Phone',
      description: 'PhoneNumber field not present',
    },
    { value: 'invalid-amount', label: 'Invalid Amount', description: 'Negative charge amount' },
    { value: 'malformed', label: 'Malformed XML', description: 'Invalid XML structure' },
  ];

  readonly restScenarios: MockScenarioOption[] = [
    { value: 'valid', label: 'Valid', description: 'Complete valid REST usage data' },
    { value: 'missing-userid', label: 'Missing UserID', description: 'user_id field not present' },
    { value: 'missing-usage', label: 'Missing Usage', description: 'usage object not present' },
    {
      value: 'invalid-structure',
      label: 'Invalid Structure',
      description: 'Wrong nested structure',
    },
    { value: 'empty-msisdn', label: 'Empty MSISDN', description: 'MSISDN is empty string' },
  ];

  loadSoapMock(scenario: MockScenario): Observable<string> {
    return this.http.get(`/assets/mocks/soap-${scenario}.xml`, { responseType: 'text' });
  }

  loadRestMock(scenario: MockScenario): Observable<string> {
    return this.http.get(`/assets/mocks/rest-${scenario}.json`, { responseType: 'text' });
  }

  loadExpectedOutput(): Observable<string> {
    return this.http.get('/assets/mocks/internal-expected.json', { responseType: 'text' });
  }
}
