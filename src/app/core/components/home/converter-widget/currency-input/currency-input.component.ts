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

@Component({
  selector: 'app-currency-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './currency-input.component.html',
  styleUrl: './currency-input.component.scss',
})
export class CurrencyInputComponent implements OnInit, OnChanges, OnDestroy {
  @Input({
    required: true,
  })
  label: 'Amount' | 'Converted Amount';

  @Input({
    required: true,
  })
  currencyList: Currency[];

  listIsOpen: boolean = false;

  amountSubs: Subscription;
  convertedAmountSubs: Subscription;

  activeCurrency: Currency;

  amount: Currency;
  convertedAmount: Currency;

  converterService = inject(ConverterService);

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.amountSubs) {
      this.amountSubs.unsubscribe();
      this.convertedAmountSubs.unsubscribe();
    }

    this.amountSubs = this.converterService.amount$.subscribe((res) => {
      this.amount = res;
      if (this.label === 'Amount') {
        this.activeCurrency = res;
        console.log(this.activeCurrency);
      }
    });

    this.convertedAmountSubs = this.converterService.convertedAmount$.subscribe(
      (res) => {
        this.convertedAmount = res;
        if (this.label === 'Converted Amount') {
          this.activeCurrency = res;
          console.log(this.activeCurrency);
        }
      }
    );
  }

  onOpenList() {
    this.listIsOpen = !this.listIsOpen;
  }

  setAmount(currency: Currency) {
    // если выбирать одинаковые валюты, то он обменивает местами, если нет, то просто передает новое значение
    if (this.label === 'Amount') {
      if (currency.code === this.convertedAmount.code) {
        //проверка равны валюты или нет
        this.converterService.convertedAmount$.next(this.amount);
        this.converterService.amount$.next(currency);
      } else {
        this.converterService.amount$.next(currency);
      }
    } else if (this.label === 'Converted Amount') {
      //проверка равны валюты или нет
      if (currency.code === this.amount.code) {
        this.converterService.amount$.next(this.convertedAmount);
        this.converterService.convertedAmount$.next(currency);
      } else {
        this.converterService.convertedAmount$.next(currency);
      }
    }

    this.listIsOpen = false;
  }

  ngOnDestroy(): void {
    if (this.amountSubs) this.amountSubs.unsubscribe();
    if (this.convertedAmountSubs) this.convertedAmountSubs.unsubscribe();
  }
}
