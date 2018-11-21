import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {
  public loader = '...';
  private count = 3;

  constructor() {}

  ngOnInit() {
    this.processLoader();
  }

  private processLoader() {
    setInterval(() => {
      if (this.count === 3) {
        this.count = 0;
        this.loader = '';
      } else {
        this.loader += '.';
        this.count++;
      }
    }, 500);
  }
}
