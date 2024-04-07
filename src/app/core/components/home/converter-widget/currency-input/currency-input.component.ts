import { CommonModule } from '@angular/common';
import {
  Component,
  OnChanges,
  SimpleChanges,
  OnInit,
  Input,
  inject,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core';
import { Currency } from '../../../../models/models';
import { ConverterService } from '../../../../services/converter.service';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ExchangeRateService } from '../../../../services/exchangeRate.service';

@Component({
  selector: 'app-currency-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './currency-input.component.html',
  styleUrl: './currency-input.component.scss',
})
export class CurrencyInputComponent implements OnInit, OnDestroy {
  // Входные свойства компонента
  @Input({
    required: true,
  })
  label: 'Amount' | 'Converted Amount'; // Метка для поля ввода: 'Amount' или 'Converted Amount'

  @Input({
    required: true,
  })
  currencyList: Currency[]; // Список валют для выбора

  // Переменная для отображения/скрытия выпадающего списка выбора валюты
  listIsOpen: boolean = false;

  // Подписки на сервисы для отслеживания изменений
  amountSubs: Subscription;
  convertedAmountSubs: Subscription;
  currencyFromSubs: Subscription;
  exchangeRateSubs: Subscription;

  // Активная выбранная валюта
  activeCurrency: Currency;

  // Текущая сумма и сконвертированная сумма
  amount: Currency;
  convertedAmount: Currency;

  // Текущий обменный курс
  exchangeRate: number;

  // Сервисы для конвертации и обменного курса
  converterService = inject(ConverterService);
  exchangeRateService = inject(ExchangeRateService);

  // Значение ввода
  inputValue: number;
  inputValueTo: number;
  inputValueFrom: number;

  // Инициализация компонента
  ngOnInit(): void {
    // Получаем текущий обменный курс
    this.getExchangeRate();

    // Отписываемся от предыдущих подписок
    if (this.amountSubs) {
      this.amountSubs.unsubscribe();
      this.convertedAmountSubs.unsubscribe();
    }

    // Получаем текущую сумму и сконвертированную сумму
    this.getAmount();
    this.getConvertedAmount();

    // Получаем текущую выбранную валюту
    this.getCurrencyFrom();
  }

  // Устанавливаем введенное значение в поле ввода
  setInputValue() {
    this.currencyFromSubs.unsubscribe(); // Отписываемся от предыдущей подписки
    if (this.inputValue >= 0) {
      this.exchangeRateService.currencyFrom.next(this.inputValue); // Устанавливаем новое значение в сервис обменного курса
    }
  }

  // Получаем текущую выбранную валюту
  getCurrencyFrom() {
    this.currencyFromSubs?.unsubscribe(); // Отписываемся от предыдущей подписки
    this.currencyFromSubs = this.exchangeRateService.currencyFrom.subscribe(
      (res) => {
        this.inputValueFrom = res; // Устанавливаем значение в поле "from"
        this.inputValueTo = res * this.exchangeRate; // Вычисляем значение в поле "to"

        // Устанавливаем значение поля ввода в зависимости от метки
        this.label === 'Amount'
          ? (this.inputValue = this.cutDecimal(
              this.inputValueFrom,
              this.activeCurrency.decimal_digits
            ))
          : (this.inputValue = this.cutDecimal(
              this.inputValueTo,
              this.activeCurrency.decimal_digits
            ));
      }
    );
  }

  // Получаем текущий обменный курс
  getExchangeRate() {
    this.exchangeRateSubs = this.exchangeRateService.exchangeRate.subscribe(
      (res) => {
        this.exchangeRate = res[0]; // Устанавливаем текущий обменный курс

        // Если метка "Converted Amount", вычисляем и устанавливаем значение поля ввода
        if (
          this.label === 'Converted Amount' &&
          this.inputValueFrom &&
          this.exchangeRate
        ) {
          this.inputValue = this.cutDecimal(
            this.inputValueFrom * this.exchangeRate,
            this.activeCurrency.decimal_digits
          );
        }
      }
    );
  }

  // Функция для округления числа до заданного количества знаков после запятой
  cutDecimal(number: number, decimalDigits: number): number {
    const roundedNumber: number = Number(number.toFixed(decimalDigits));
    return roundedNumber;
  }

  // Получаем текущую сумму
  getAmount() {
    this.amountSubs = this.converterService.amount$.subscribe((res) => {
      this.amount = res;
      if (this.label === 'Amount') {
        this.activeCurrency = res; // Устанавливаем текущую активную валюту
      }
    });
  }

  // Получаем текущую сконвертированную сумму
  getConvertedAmount() {
    this.convertedAmountSubs = this.converterService.convertedAmount$.subscribe(
      (res) => {
        this.convertedAmount = res;
        if (this.label === 'Converted Amount') {
          this.activeCurrency = res; // Устанавливаем текущую активную валюту
        }
      }
    );
  }

  // Открываем/закрываем выпадающий список выбора валюты
  onOpenList() {
    this.listIsOpen = !this.listIsOpen;
  }

  // Устанавливаем выбранную валюту
  setAmount(currency: Currency) {
    if (this.label === 'Amount') {
      if (currency.code === this.convertedAmount.code) {
        this.converterService.convertedAmount$.next(this.amount);
        this.converterService.amount$.next(currency);
      } else {
        this.converterService.amount$.next(currency);
      }
    } else if (this.label === 'Converted Amount') {
      if (currency.code === this.amount.code) {
        this.converterService.amount$.next(this.convertedAmount);
        this.converterService.convertedAmount$.next(currency);
      } else {
        this.converterService.convertedAmount$.next(currency);
      }
    }

    this.listIsOpen = false; // Закрываем список выбора валюты после выбора
  }

  // Отписываемся от всех подписок при уничтожении компонента
  ngOnDestroy(): void {
    if (this.amountSubs) this.amountSubs.unsubscribe();
    if (this.convertedAmountSubs) this.convertedAmountSubs.unsubscribe();
    if (this.currencyFromSubs) this.currencyFromSubs.unsubscribe();
    if (this.exchangeRateSubs) this.exchangeRateSubs.unsubscribe();
  }
}
