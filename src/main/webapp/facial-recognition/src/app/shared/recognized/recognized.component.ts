import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-recognized',
  templateUrl: './recognized.component.html',
  styleUrls: ['./recognized.component.scss']
})
export class RecognizedComponent implements OnInit {
  @Input()
  person;

  constructor() {}

  ngOnInit() {}
}
