import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ExchangeRate, ExchangeRateData } from '../models/models';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExchangeRateService {
  constructor() {}
  http = inject(HttpClient);

  private currencyListUrl = environment.currencyApiLatestRatesUrl;

  getExchangeRate(currencies: string, baseCurrency: string): Observable<any> {
    let params = new HttpParams()
      .set('currencies', currencies)
      .set('base_currency', baseCurrency);

    return this.http
      .get<ExchangeRateData>(this.currencyListUrl, { params: params })
      .pipe(map((res) => Object.values(res.data)));
  }
}
