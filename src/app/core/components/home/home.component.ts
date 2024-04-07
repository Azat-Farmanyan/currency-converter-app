import { CommonModule } from '@angular/common';
import { Component, type OnInit } from '@angular/core';
import { ConverterWidgetComponent } from './converter-widget/converter-widget.component';
import { ExchangeRateComponent } from './exchange-rate/exchange-rate.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ConverterWidgetComponent, ExchangeRateComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
