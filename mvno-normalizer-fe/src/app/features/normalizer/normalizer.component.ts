import { Component, signal, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { XmlParserService } from '../../core/services/xml-parser.service';
import { RestParserService } from '../../core/services/rest-parser.service';
import { NormalizerService } from '../../core/services/normalizer.service';
import { FileDownloadService } from '../../core/services/file-download.service';
import { MockLoaderService, InputType } from '../../core/services/mock-loader.service';
import { TelgeaInternalFormat } from '../../core/models/telgea-internal.model';

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
  protected mockLoaderService = inject(MockLoaderService);

  protected readonly inputData = signal<string>('');
  protected readonly normalizedData = signal<TelgeaInternalFormat | null>(null);
  protected readonly errorMessage = signal<string>('');

  constructor() {
    effect(() => {
      this.setMockDataAsInputData();
    });
  }

  protected onInputChange(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    this.inputData.set(target.value);
  }

  protected onTypeChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.mockLoaderService.setInputType(target.value as InputType);
  }

  protected onMockScenarioChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.mockLoaderService.setSelectedScenario(target.value as any);
  }

  protected onNormalize(): void {
    this.resetState();

    const input = this.inputData().trim();
    if (!input) {
      this.errorMessage.set('Please enter data to normalize');
      return;
    }

    try {
      const normalized =
        this.mockLoaderService.inputType() === 'SOAP'
          ? this.normalizeSOAP(input)
          : this.normalizeREST(input);

      this.normalizedData.set(normalized);
    } catch (error) {
      this.errorMessage.set(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  }

  protected onDownload(): void {
    const data = this.normalizedData();
    if (!data) return;

    const filename = `${DOWNLOAD_FILENAME_PREFIX}-${Date.now()}.json`;
    this.fileDownloadService.downloadJson(data, filename);
  }

  protected onClear(): void {
    this.inputData.set('');
    this.mockLoaderService.clearMockData();
    this.resetState();
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

  private setMockDataAsInputData(): void {
    const mockData = this.mockLoaderService.mockData();
    if (mockData) {
      this.inputData.set(mockData);
    }
  }
}
