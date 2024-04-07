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
  currencyList: Currency[] = [];
  currencyListSubs: Subscription;

  // Вызывается при инициализации компонента
  ngOnInit(): void {
    this.fetchCurrencyList();
  }

  // Получение сервисов CurrencyListService и ConverterService с помощью inject
  currencyListService = inject(CurrencyListService);
  converterService = inject(ConverterService);

  // Запрос списка валют
  fetchCurrencyList() {
    this.currencyListService.getCurrencyList().subscribe((res: Currency[]) => {
      this.currencyList = res;

      // Установка валют по умолчанию
      this.setDefaultCurrency(res);
    });
  }

  // Установка валют по умолчанию (RUB и USD)
  setDefaultCurrency(res: Currency[]) {
    const amountCurrency = res.find((el) => el.code === 'RUB');
    if (amountCurrency) this.converterService.amount$.next(amountCurrency);

    const convertedAmount = res.find((el) => el.code === 'USD');
    if (convertedAmount)
      this.converterService.convertedAmount$.next(convertedAmount);
  }

  // Вызывается при уничтожении компонента
  ngOnDestroy(): void {
    if (this.currencyListSubs) this.currencyListSubs.unsubscribe();
  }
}
