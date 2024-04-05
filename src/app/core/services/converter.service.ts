import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Currency, CurrencyList, CurrencyListItem } from '../models/models';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable, Subject, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConverterService {
  http = inject(HttpClient);

  amount$ = new Subject<Currency>();
  convertedAmount$ = new Subject<Currency>();

  constructor() {}

  setAmount(value: Currency) {
    this.amount$.next(value);
  }

  setConvertedAmount(value: Currency) {
    this.convertedAmount$.next(value);
  }
}
