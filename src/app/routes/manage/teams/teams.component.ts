import { Component, OnInit } from '@angular/core';
import { TeamsService } from './teams.service';
import { SettingsService } from '@core';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.less']
})
export class TeamsComponent implements OnInit {

  root: string;

  constructor(
    private service: TeamsService,
    private settings: SettingsService
    ) { }

  ngOnInit() {
    // this.settings.user;
    this.service.getDepartments().subscribe(result => {
      console.log(result);
    });
  }

}
