import { Routes } from '@angular/router';
import { NormalizerComponent } from './features/normalizer/normalizer.component';

export const routes: Routes = [
  { path: '', component: NormalizerComponent },
  { path: '**', redirectTo: '' },
];
