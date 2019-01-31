import { Component, OnInit, ViewChild, TemplateRef, Inject } from '@angular/core';
import { SettingsService } from '@core';

@Component({
  selector: 'app-team-info',
  template: `
    <div class="container">
      <h3 class="color-subhead">{{ settings?.user?.company_full_name }}</h3>
    </div>
  `,
  styles: [`
  .container {
    justify-content: center;
    align-items: center;
  }
  `]
})
export class TeamInfoComponent implements OnInit {

  constructor(
    public settings: SettingsService
  ) { }

  ngOnInit() {
  }
}
