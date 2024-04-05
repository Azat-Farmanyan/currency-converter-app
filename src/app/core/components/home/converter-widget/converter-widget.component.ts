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

  ngOnInit(): void {
    this.fetchCurrencyList();
  }
  currencyListService = inject(CurrencyListService);
  converterService = inject(ConverterService);

  fetchCurrencyList() {
    this.currencyListService.getCurrencyList().subscribe((res: Currency[]) => {
      this.currencyList = res;

      this.setDefaultCurrency(res);
    });
  }

  setDefaultCurrency(res: Currency[]) {
    const amountCurrency = res.find((el) => el.code === 'RUB');
    if (amountCurrency) this.converterService.amount$.next(amountCurrency);

    const convertedAmount = res.find((el) => el.code === 'USD');
    if (convertedAmount)
      this.converterService.convertedAmount$.next(convertedAmount);
  }

  ngOnDestroy(): void {
    if (this.currencyListSubs) this.currencyListSubs.unsubscribe();
  }
}
