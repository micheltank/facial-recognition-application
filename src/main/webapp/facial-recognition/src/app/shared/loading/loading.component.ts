import {
  Component,
  OnInit,
  Input,
  SimpleChanges,
  ViewChild,
  ElementRef
} from '@angular/core';
import { PendingRequestsService } from '@shared/loading/pending-requests/pending-requests.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {
  @Input()
  active: boolean;
  @Input()
  activeOnPendingRequests: boolean;

  constructor(private pendingReqsService: PendingRequestsService) {}

  ngOnInit() {
    this.pendingReqsService.onPendingRequest().subscribe(numOfPendingReqs => {
      if (numOfPendingReqs > 0) {
        this.active = true;
      } else {
        this.active = false;
      }
    });
  }
}
