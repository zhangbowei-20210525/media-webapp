import { Component, OnInit } from '@angular/core';
import { TransmitService } from '../transmit.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pur-tape-details',
  templateUrl: './pur-tape-details.component.html',
  styleUrls: ['./pur-tape-details.component.less']
})
export class PurTapeDetailsComponent implements OnInit {

  dataSet = [];
  id: number;
  info: any;

  constructor(
    private service: TransmitService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
        this.id = +params.get('id');
        this.service.getPurTapeInfo(this.id).subscribe(res => {
           this.info = res;
        });
        this.service.getPurTapeFile(this.id).subscribe(res => this.dataSet = res.list);
    });
  }

}
