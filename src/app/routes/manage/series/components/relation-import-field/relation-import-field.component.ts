import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-relation-import-field',
  templateUrl: './relation-import-field.component.html',
  styleUrls: ['./relation-import-field.component.less']
})
export class RelationImportFieldComponent implements OnInit {

  @Input() theme: { raw: string, real: string }[];
  @Input() programType: { raw: string, real: string }[];

  constructor() { }

  ngOnInit() {
  }

}
