import { CopyrightsComponent } from './copyrights/copyrights.component';
import { PublicitiesComponent } from './publicities/publicities.component';
import { AllSeriesComponent } from './all-series/all-series.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SeriesComponent } from './series.component';
import { SeriesDetailsComponent } from './details/details.component';
import { AddCopyrightsComponent } from './copyrights/add-copyrights/add-copyrights.component';
import { RightComponent } from './details/right/right.component';
import { PublishRightsComponent } from './copyrights/publish-rights/publish-rights.component';
import { PublicityDetailsComponent } from './publicities/publicity-details/publicity-details.component';
import { TapesComponent } from './tapes/tapes.component';
import { PublicityComponent } from './details/publicity/publicity.component';
import { TapeComponent } from './details/tape/tape.component';
import { ContractsComponent } from './contracts/contracts.component';
import { ProcurementComponent } from './contracts/procurement/procurement.component';
import { PublishedComponent } from './contracts/published/published.component';
import { PublishedComponent as PublishedListComponent } from './copyrights/published/published.component';
import { AllRightsComponent } from './copyrights/all-rights/all-rights.component';
import { ContractDetailsComponent } from './contracts/contract-details/contract-details.component';
import { ChoreographyComponent } from './choreography/choreography.component';
import { TheatreComponent } from './choreography/theatre/theatre.component';



const routes: Routes = [
  {
    path: '',
    component: SeriesComponent,
    children: [
      { path: '', redirectTo: 'all', pathMatch: 'full' },
      {
        path: 'all',
        component: AllSeriesComponent
      },
      {
        path: 'publicity',
        component: PublicitiesComponent
      },
      {
        path: 'tapes',
        component: TapesComponent
      },
      {
        path: 'choreography', component: ChoreographyComponent,
        children: [
          {
            path: 'theatre',
            component: TheatreComponent
          },
          {
            path: 'info',
            component: TheatreComponent
          },

        ]
      },
      {
        path: 'rights',
        component: CopyrightsComponent,
        children: [
          { path: '', redirectTo: 'all', pathMatch: 'full' },
          {
            path: 'all',
            component: AllRightsComponent
          },
          {
            path: 'published',
            component: PublishedListComponent
          },
        ]
      },
      {
        path: 'contracts',
        component: ContractsComponent,
        children: [
          { path: '', redirectTo: 'procurement', pathMatch: 'full' },
          { path: 'procurement', component: ProcurementComponent },
          { path: 'published', component: PublishedComponent }
        ]
      },
    ]
  },
  { path: 'publicity-details/:id', component: PublicityDetailsComponent },
  {
    path: 'cd/:id',
    component: ContractDetailsComponent
  },
  {
    path: 'd/:sid',
    component: SeriesDetailsComponent,
    children: [
      { path: 'publicityd', component: PublicityComponent },
      { path: 'right', component: RightComponent },
      { path: 'tape', component: TapeComponent }
    ]
  },
  { path: 'add-copyrights', component: AddCopyrightsComponent },
  { path: 'publish-rights', component: PublishRightsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SeriesRoutingModule { }



