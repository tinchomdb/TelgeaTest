import { Injectable, inject, signal, computed, DestroyRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export type InputType = 'SOAP' | 'REST';

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
  private destroyRef = inject(DestroyRef);
  private readonly MOCK_BASE_PATH = '/assets/mocks';

  private readonly soapScenarios: ScenarioOption[] = [
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

  private readonly restScenarios: ScenarioOption[] = [
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

  // Public signals
  readonly inputType = signal<InputType>('REST');
  readonly selectedMockScenario = signal<SoapScenario | RestScenario | ''>('');
  readonly mockData = signal<string>('');

  // Computed signal that returns appropriate scenarios based on input type
  readonly mockScenarios = computed<ScenarioOption[]>(() => {
    return this.inputType() === 'SOAP' ? this.soapScenarios : this.restScenarios;
  });

  setInputType(type: InputType): void {
    this.inputType.set(type);
    this.selectedMockScenario.set(''); // Reset selected scenario when type changes
    this.mockData.set(''); // Clear mock data when type changes
  }

  setSelectedScenario(scenario: SoapScenario | RestScenario | ''): void {
    this.selectedMockScenario.set(scenario);

    if (scenario) {
      this.loadMock(scenario as SoapScenario | RestScenario);
    } else {
      this.mockData.set(''); // Clear data when no scenario selected
    }
  }

  clearMockData(): void {
    this.mockData.set('');
    this.selectedMockScenario.set('');
  }

  private loadMock(scenario: SoapScenario | RestScenario): void {
    const loader$ =
      this.inputType() === 'SOAP'
        ? this.loadSoapMock(scenario as SoapScenario)
        : this.loadRestMock(scenario as RestScenario);

    loader$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data) => {
        this.mockData.set(data);
      },
      error: (error) => {
        console.error('Failed to load mock data:', error);
        this.mockData.set('');
      },
    });
  }

  private loadSoapMock(scenario: SoapScenario): Observable<string> {
    return this.http.get(`${this.MOCK_BASE_PATH}/soap-${scenario}.xml`, { responseType: 'text' });
  }

  private loadRestMock(scenario: RestScenario): Observable<string> {
    return this.http.get(`${this.MOCK_BASE_PATH}/rest-${scenario}.json`, { responseType: 'text' });
  }
}
