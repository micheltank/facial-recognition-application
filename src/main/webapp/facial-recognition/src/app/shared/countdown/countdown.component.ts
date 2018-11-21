import {
  Component,
  Output,
  Input,
  EventEmitter,
  OnChanges,
  OnDestroy,
  SimpleChanges
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.scss']
})
export class CountdownComponent implements OnChanges, OnDestroy {
  @Output()
  public countEnd = new EventEmitter<any>();
  public _counter = 0;
  @Output()
  public counterChange = new EventEmitter<number>();
  private counterInterval;
  @Input()
  public get counter() {
    return this._counter;
  }

  public set counter(counter: number) {
    this._counter = counter;
    this.counterChange.emit(counter);
  }

  constructor(public translate: TranslateService) {}

  ngOnChanges(changes: SimpleChanges) {
    const prevCounterValue = changes.counter.previousValue;
    const currCounterValue = changes.counter.currentValue;

    if (prevCounterValue === undefined && currCounterValue === undefined) {
      throw new Error('A input property initialValue deve ser informada');
    }

    if (currCounterValue) {
      this.killCounterInterval();
      this.counter = currCounterValue;
      this.startCounterInterval();
    }
  }

  ngOnDestroy() {
    this.killCounterInterval();
  }

  private killCounterInterval() {
    if (this.counterInterval) {
      clearInterval(this.counterInterval);
    }
  }

  private startCounterInterval() {
    this.counterInterval = setInterval(() => {
      this.counter--;
      if (this.counter === 0) {
        this.countEnd.emit();
        this.killCounterInterval();
      }
    }, 1000);
  }
}
