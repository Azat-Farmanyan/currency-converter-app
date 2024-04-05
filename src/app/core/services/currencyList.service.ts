import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CurrencyListItem, CurrencyList, Currency } from '../models/models';

@Injectable({
  providedIn: 'root',
})
export class CurrencyListService {
  http = inject(HttpClient);

  private currencyListUrl = environment.currencyListUrl;

  constructor() {}

  getCurrencyList(): Observable<Currency[]> {
    return this.http
      .get<CurrencyList>(this.currencyListUrl)
      .pipe(map((res) => Object.values(res.data)));
  }
}
