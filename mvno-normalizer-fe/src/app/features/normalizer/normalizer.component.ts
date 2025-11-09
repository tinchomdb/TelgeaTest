import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { XmlParserService } from '../../core/services/xml-parser.service';
import { RestParserService } from '../../core/services/rest-parser.service';
import { NormalizerService } from '../../core/services/normalizer.service';
import { FileDownloadService } from '../../core/services/file-download.service';
import {
  MockLoaderService,
  MockScenario,
  MockScenarioOption,
} from '../../core/services/mock-loader.service';
import { TelgeaInternalFormat } from '../../core/models/telgea-internal.model';

type InputType = 'SOAP' | 'REST';

const DOWNLOAD_FILENAME_PREFIX = 'telgea-normalized';

@Component({
  selector: 'app-normalizer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './normalizer.component.html',
  styleUrl: './normalizer.component.scss',
})
export class NormalizerComponent {
  private xmlParserService = inject(XmlParserService);
  private restParserService = inject(RestParserService);
  private normalizerService = inject(NormalizerService);
  private fileDownloadService = inject(FileDownloadService);
  private mockLoaderService = inject(MockLoaderService);

  readonly inputData = signal<string>('');
  readonly inputType = signal<InputType>('REST');
  readonly normalizedData = signal<TelgeaInternalFormat | null>(null);
  readonly errorMessage = signal<string>('');
  readonly selectedMockScenario = signal<MockScenario>('valid');

  get mockScenarios(): MockScenarioOption[] {
    return this.inputType() === 'SOAP'
      ? this.mockLoaderService.soapScenarios
      : this.mockLoaderService.restScenarios;
  }

  onInputChange(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    this.inputData.set(target.value);
  }

  onTypeChange(type: InputType): void {
    this.inputType.set(type);
    this.selectedMockScenario.set('valid');
  }

  onMockScenarioChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedMockScenario.set(target.value as MockScenario);
  }

  onNormalize(): void {
    this.resetState();

    const input = this.inputData().trim();
    if (!input) {
      this.errorMessage.set('Please enter data to normalize');
      return;
    }

    try {
      const normalized =
        this.inputType() === 'SOAP' ? this.normalizeSOAP(input) : this.normalizeREST(input);

      this.normalizedData.set(normalized);
    } catch (error) {
      this.errorMessage.set(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  }

  private resetState(): void {
    this.errorMessage.set('');
    this.normalizedData.set(null);
  }

  private normalizeSOAP(input: string): TelgeaInternalFormat {
    const parsedSoap = this.xmlParserService.parseSOAPCharge(input);
    return this.normalizerService.normalizeSOAPChargeSMS(parsedSoap);
  }

  private normalizeREST(input: string): TelgeaInternalFormat {
    const parsedRest = this.restParserService.parseRESTDataUsage(input);
    return this.normalizerService.normalizeRESTDataUsage(parsedRest);
  }

  onDownload(): void {
    const data = this.normalizedData();
    if (!data) return;

    const filename = `${DOWNLOAD_FILENAME_PREFIX}-${Date.now()}.json`;
    this.fileDownloadService.downloadJson(data, filename);
  }

  onClear(): void {
    this.inputData.set('');
    this.resetState();
  }

  onLoadMock(): void {
    this.resetState();

    const scenario = this.selectedMockScenario();
    const loader$ =
      this.inputType() === 'SOAP'
        ? this.mockLoaderService.loadSoapMock(scenario)
        : this.mockLoaderService.loadRestMock(scenario);

    loader$.subscribe({
      next: (data) => {
        this.inputData.set(data);
      },
      error: (error) => {
        this.errorMessage.set(`Failed to load mock data: ${error.message}`);
      },
    });
  }
}
