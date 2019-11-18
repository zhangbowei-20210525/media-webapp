import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageComponent } from './manage.component';
// import { DashboardComponent } from './dashboard/dashboard.component';
import { SharedModule } from '@shared';
// import { LayoutModule } from 'app/layout/layout.module';
import { PersonalCenterComponent } from './personal-center/personal-center.component';
import { BrowseRecordComponent } from './personal-center/browse-record/browse-record.component';
import { PubAuthorizationReceiveComponent } from './pub-authorization-receive/pub-authorization-receive.component';
import { FilmReviewComponent } from './film-review/film-review.component';
import { EditFilmReviewTeamComponent } from './film-review/components/edit-film-review-team/edit-film-review-team.component';
import { AddFilmReviewTeamComponent } from './film-review/components/add-film-review-team/add-film-review-team.component';
import { DeleteFilmReviewTeamComponent } from './film-review/components/delete-film-review-team/delete-film-review-team.component';
import { DeleteFilmReviewPeopleComponent } from './film-review/components/delete-film-review-people/delete-film-review-people.component';
import { AddFilmReviewPeopleComponent } from './film-review/components/add-film-review-people/add-film-review-people.component';
import { ConclusionConfigInfoComponent } from './film-review/components/conclusion-config-info/conclusion-config-info.component';
import { ScoreConfigComponent } from './film-review/components/score-config/score-config.component';
import { AddScoreComponent } from './film-review/components/add-score/add-score.component';
import { DeleteScoreComponent } from './film-review/components/delete-score/delete-score.component';
import { IdeaConfigComponent } from './film-review/components/idea-config/idea-config.component';
import { DeclareAuthorizationReceiveComponent } from './declare-authorization-receive/declare-authorization-receive.component';
import { MySharingComponent } from './personal-center/my-sharing/my-sharing.component';
import { MyCallupComponent } from './personal-center/my-callup/my-callup.component';
import { SmplesDetailsComponent } from './personal-center/my-callup/smples-details/smples-details.component';
import { MySmplesComponent } from './personal-center/my-callup/my-smples/my-smples.component';
// import { ImageComponent } from './image/image/image.component';
// import { ImageDetailsComponent } from './image/image/image-details/image-details.component';

@NgModule({
  declarations: [
    ManageComponent,
    // DashboardComponent,
    PersonalCenterComponent,
    BrowseRecordComponent,
    PubAuthorizationReceiveComponent,
    FilmReviewComponent,
    EditFilmReviewTeamComponent,
    AddFilmReviewTeamComponent,
    DeleteFilmReviewTeamComponent,
    DeleteFilmReviewPeopleComponent,
    AddFilmReviewPeopleComponent,
    ConclusionConfigInfoComponent,
    ScoreConfigComponent,
    AddScoreComponent,
    DeleteScoreComponent,
    IdeaConfigComponent,
    DeclareAuthorizationReceiveComponent,
    MySharingComponent,
    MyCallupComponent,
    SmplesDetailsComponent,
    MySmplesComponent,
    // ImageComponent,
    // ImageDetailsComponent,
   ],
  imports: [
    CommonModule,
    SharedModule,
    // LayoutModule,
    FormsModule
  ],
  entryComponents: [
    EditFilmReviewTeamComponent,
    AddFilmReviewTeamComponent,
    DeleteFilmReviewTeamComponent,
    DeleteFilmReviewPeopleComponent,
    AddFilmReviewPeopleComponent,
    ConclusionConfigInfoComponent,
    ScoreConfigComponent,
    AddScoreComponent,
    DeleteScoreComponent,
    IdeaConfigComponent,
    MySharingComponent,
    MySmplesComponent,
    MyCallupComponent,
    SmplesDetailsComponent,
  ]
})
export class ManageModule { }
