import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CurrencyInputComponent } from './currency-input/currency-input.component';
import { Currency } from '../../../models/models';
import { CurrencyListService } from '../../../services/currencyList.service';
import { Subscription } from 'rxjs';
import { ConverterService } from '../../../services/converter.service';

@Component({
  selector: 'app-converter-widget',
  standalone: true,
  imports: [CommonModule, CurrencyInputComponent],
  templateUrl: './converter-widget.component.html',
  styleUrl: './converter-widget.component.scss',
})
export class ConverterWidgetComponent implements OnInit, OnDestroy {
  // Получение сервисов CurrencyListService и ConverterService с помощью inject
  currencyListService = inject(CurrencyListService);
  converterService = inject(ConverterService);

  currencyList: Currency[] = [];
  currencyListSubs: Subscription;
  amountSubs: Subscription;
  convertedAmountSubs: Subscription;

  amount: Currency;
  convertedAmount: Currency;

  // Вызывается при инициализации компонента
  ngOnInit(): void {
    this.fetchCurrencyList();
  }

  // Запрос списка валют
  fetchCurrencyList() {
    this.currencyListService.getCurrencyList().subscribe((res: Currency[]) => {
      this.currencyList = res;

      // Установка валют по умолчанию
      this.setCurrency(res, 'RUB', 'USD');
    });
  }

  // Установка валют по умолчанию (RUB и USD)
  setCurrency(
    res: Currency[],
    amountCurrencyCode: string,
    convertedAmountCode: string
  ) {
    const amountCurrency = this.searchInCurrencyList(res, amountCurrencyCode);
    if (amountCurrency) this.converterService.amount$.next(amountCurrency);

    const convertedAmount = this.searchInCurrencyList(res, convertedAmountCode);
    if (convertedAmount)
      this.converterService.convertedAmount$.next(convertedAmount);
  }

  searchInCurrencyList(currencyList: Currency[], currencyCode: string) {
    return currencyList.find((el) => el.code === currencyCode);
  }

  // Вызывается при уничтожении компонента
  ngOnDestroy(): void {
    if (this.currencyListSubs) this.currencyListSubs.unsubscribe();
  }
}
