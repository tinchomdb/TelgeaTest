import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// SOAP scenarios that have corresponding XML files
export type SoapScenario =
  | 'valid'
  | 'missing-userid'
  | 'missing-phone'
  | 'invalid-amount'
  | 'malformed';

// REST scenarios that have corresponding JSON files
export type RestScenario =
  | 'valid'
  | 'missing-userid'
  | 'missing-usage'
  | 'invalid-structure'
  | 'empty-msisdn';

export interface ScenarioOption {
  value: SoapScenario | RestScenario;
  label: string;
  description: string;
}

@Injectable({
  providedIn: 'root',
})
export class MockLoaderService {
  private http = inject(HttpClient);
  private readonly MOCK_BASE_PATH = '/assets/mocks';

  readonly soapScenarios: ScenarioOption[] = [
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

  readonly restScenarios: ScenarioOption[] = [
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

  loadSoapMock(scenario: SoapScenario): Observable<string> {
    return this.http.get(`${this.MOCK_BASE_PATH}/soap-${scenario}.xml`, { responseType: 'text' });
  }

  loadRestMock(scenario: RestScenario): Observable<string> {
    return this.http.get(`${this.MOCK_BASE_PATH}/rest-${scenario}.json`, { responseType: 'text' });
  }
}
