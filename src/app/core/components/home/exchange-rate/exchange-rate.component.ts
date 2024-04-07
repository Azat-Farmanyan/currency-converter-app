import { CommonModule } from '@angular/common';
import { Component, type OnInit, inject, OnDestroy } from '@angular/core';
import { ExchangeRateService } from '../../../services/exchangeRate.service';
import { ConverterService } from '../../../services/converter.service';
import { Subscription, forkJoin } from 'rxjs';
import { Currency } from '../../../models/models';

@Component({
  selector: 'app-exchange-rate',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './exchange-rate.component.html',
  styleUrl: './exchange-rate.component.scss',
})
export class ExchangeRateComponent implements OnInit, OnDestroy {
  exchangeRateService = inject(ExchangeRateService);
  converterService = inject(ConverterService);

  amountSubs: Subscription;
  convertedAmountSubs: Subscription;

  amount: Currency;
  convertedAmount: Currency;
  exchangeRate: number;

  // Вызывается при инициализации компонента
  ngOnInit(): void {
    this.getAmount();
    this.getConvertedAmount();
  }

  // Получение значения ввода для основной валюты
  getAmount() {
    this.amountSubs = this.converterService.amount$.subscribe((res) => {
      this.amount = res;
      this.callExchangeRateService();
    });
  }

  // Получение значения ввода для конвертируемой валюты
  getConvertedAmount() {
    this.convertedAmountSubs = this.converterService.convertedAmount$.subscribe(
      (res) => {
        this.convertedAmount = res;
        this.callExchangeRateService();
      }
    );
  }

  // Вызов сервиса обменного курса
  callExchangeRateService() {
    if (this.amount && this.convertedAmount) {
      this.exchangeRateService
        .getExchangeRate(this.convertedAmount.code, this.amount.code)
        .subscribe((res) => {
          // Установка значения обменного курса
          this.exchangeRate = res;
        });
    }
  }

  // Вызывается при уничтожении компонента
  ngOnDestroy(): void {
    if (this.amountSubs) this.amountSubs.unsubscribe();
    if (this.convertedAmountSubs) this.convertedAmountSubs.unsubscribe();
  }
}
