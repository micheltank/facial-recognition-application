import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-blocked',
  templateUrl: './blocked.component.html',
  styleUrls: ['./blocked.component.scss']
})
export class BlockedComponent implements OnInit {
  @Input()
  person;

  constructor() {}

  ngOnInit() {}
}
