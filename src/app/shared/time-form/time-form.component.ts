import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, QueryList, ViewChild, viewChild, ViewChildren } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-time-form',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
  ],
  templateUrl: './time-form.component.html',
  styleUrl: './time-form.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting:  TimeFormComponent,
      multi: true
    }
  ],
})
export class TimeFormComponent implements ControlValueAccessor {
  public hora: string = '01:00 PM';

  // private el: ElementRef<HTMLElement>; Necesita inicializarse, y el contructor ya lo hace
  constructor(private el: ElementRef<HTMLElement>) {}
  
  @ViewChildren('hourDiv') houDivs!: QueryList<ElementRef>;
  @ViewChildren('minuteDiv') minDivs!: QueryList<ElementRef>;

  hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

  hour: string = '01';
  minute: string = '00';
  period: 'AM' | 'PM' = 'PM';

  private onChangeFn: any = () => {};
  private onTouchedFn: any = () => {};

  private updateValue() {
    const value = `${this.hour}:${this.minute} ${this.period}`;

    this.hora = value;

    this.onChangeFn(value);
    this.onTouchedFn();
  }

  writeValue(value: string): void {
    if (value) {
      const [time, period] = value.split(' ');
      const [h, m] = time.split(':');
      this.hour = h;
      this.minute = m;

      this.period = period as 'AM' |  'PM';
    }
  }
  
  registerOnChange(fn: any): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedFn = fn;
  }

  open: Boolean = false;
  
  showTime() {
    this.open = !this.open
  }

  selectHour(h: string): void {
    this.hour = h;
    this.updateValue();
    setTimeout(() => this.scrollActiveHour());
  }

  selectMinute(m: string): void {
    this.minute = m;
    this.updateValue();
    setTimeout(() => this.scrollActiveMinutes());
  }

  selectPeriod(p: "AM" | "PM"): void {
    this.period = p;
    this.updateValue();
  }

  @HostListener('document:click', ['$event'])
  onDocClick(ev: MouseEvent) {
    if (!this.open) return;
    if (!this.el.nativeElement.contains(ev.target as Node)) {
      this.open = false;
    }
  }

  private scrollActiveHour() {
    const activeHour = this.houDivs.find(div => div.nativeElement.classList.contains('active'));

    if (activeHour) {
      activeHour.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  private scrollActiveMinutes() {
    const activeMinutes = this.minDivs.find(div => div.nativeElement.classList.contains('active'));

    if (activeMinutes) {
      activeMinutes.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }


}

