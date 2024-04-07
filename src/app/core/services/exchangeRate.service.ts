import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ExchangeRate, ExchangeRateData } from '../models/models';
import { Observable, Subject, debounceTime, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExchangeRateService {
  constructor() {}

  // Инициализация HttpClient
  http = inject(HttpClient);

  // Subject для обменного курса
  exchangeRate = new Subject<number[]>();

  // Subject для отправленной валюты
  currencyFrom = new Subject<number>();

  // URL для получения списка обменных курсов
  private currencyListUrl = environment.currencyApiLatestRatesUrl;

  // Получение обменного курса для заданных валют
  getExchangeRate(currencies: string, baseCurrency: string): Observable<any> {
    let params = new HttpParams()
      .set('currencies', currencies)
      .set('base_currency', baseCurrency);

    // Выполнение GET запроса к API для получения обменного курса
    return this.http
      .get<ExchangeRateData>(this.currencyListUrl, { params: params })
      .pipe(
        // Извлечение значений обменного курса из ответа
        map((res) => Object.values(res.data)),
        debounceTime(2000),
        // Отправка обновленного обменного курса через Subject
        tap((res) => this.exchangeRate.next(res))
      );
  }
}
