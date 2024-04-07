import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Currency, CurrencyList, CurrencyListItem } from '../models/models';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable, Subject, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConverterService {
  // Инициализация HttpClient
  http = inject(HttpClient);

  // Subject для значения основной валюты
  amount$ = new Subject<Currency>();

  // Subject для значения конвертированной валюты
  convertedAmount$ = new Subject<Currency>();

  constructor() {}

  // Установка значения основной валюты
  setAmount(value: Currency) {
    this.amount$.next(value);
  }

  // Установка значения конвертированной валюты
  setConvertedAmount(value: Currency) {
    this.convertedAmount$.next(value);
  }
}
