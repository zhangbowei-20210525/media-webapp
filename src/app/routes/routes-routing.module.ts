import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SelectivePreloadingStrategy } from '../core';
import { LayoutComponent } from '../layout/layout.component';
import { MarketComponent } from './market/market.component';
import { ManageComponent } from './manage/manage.component';
import { DashboardComponent } from './manage/dashboard/dashboard.component';
import { PersonalCenterComponent } from './manage/personal-center/personal-center.component';
import { SimpleGuard } from '@delon/auth';
// import { SeriesComponent } from './manage/series/series.component';
import { BrowseRecordComponent } from './manage/personal-center/browse-record/browse-record.component';
import { MarketDetailsComponent } from './market/market-details/market-details.component';
import { PubAuthorizationReceiveComponent } from './manage/pub-authorization-receive/pub-authorization-receive.component';
import { DeclareAuthorizationReceiveComponent } from './manage/declare-authorization-receive/declare-authorization-receive.component';
import { ACLGuard, ACLType } from '@delon/acl';
import { aclAbility } from '@core/acl';
import { PassportComponent } from 'app/layout/passport/passport.component';
import { LoginComponent } from './passport/login/login.component';
import { PhoneLoginComponent } from './passport/login/phone-login/phone-login.component';
import { WechatLoginComponent } from './passport/login/wechat-login/wechat-login.component';
import { BindingComponent } from './passport/binding/binding.component';
import { PhoneBindingComponent } from './passport/binding/phone-binding/phone-binding.component';
import { CompanyBindingComponent } from './passport/binding/company-binding/company-binding.component';
import { FilmReviewComponent } from './manage/film-review/film-review.component';
import { MySharingComponent } from './manage/personal-center/my-sharing/my-sharing.component';
import { MyCallupComponent } from './manage/personal-center/my-callup/my-callup.component';
import { MySmplesComponent } from './manage/personal-center/my-callup/my-smples/my-smples.component';
import { SmplesDetailsComponent } from './manage/personal-center/my-callup/smples-details/smples-details.component';
import { ChoreographyComponent } from './manage/choreography/choreography.component';
import { InfoComponent } from './manage/choreography/info/info.component';
import { EditBroadcastPlanComponent } from './manage/choreography/edit-broadcast-plan/edit-broadcast-plan.component';
import { TheatreComponent } from './manage/choreography/theatre/theatre.component';
// import { ImageComponent } from './manage/image/image/image.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    data: { breadcrumb: 'Home' },
    canActivate: [SimpleGuard],
    children: [
      { path: '', redirectTo: 'market', pathMatch: 'full' },
      {
        path: 'market',
        component: MarketComponent,
      },
      { path: 'd/:id', component: MarketDetailsComponent },
      {
        path: 'manage',
        component: ManageComponent,
        data: { breadcrumb: 'Manage' },
        // canActivate: [SimpleGuard],
        children: [
          { path: '', redirectTo: 'series', pathMatch: 'full' },
          {
            path: 'messages',
            loadChildren: './manage/messages/messages.module#MessagesModule',
          },
          {
            path: 'dashboard',
            canActivate: [ACLGuard], data: { guard: <ACLType>{ ability: [aclAbility.analysis.view] } },
            component: DashboardComponent
          },
          {
            path: 'film-review',
            component: FilmReviewComponent
          },
          {
            path: 'pubAuthorizationReceive',
            component: PubAuthorizationReceiveComponent
          },
          {
            path: 'DeclareAuthorizationReceive',
            component: DeclareAuthorizationReceiveComponent
          },
          {
            path: 'image', loadChildren: './manage/image/image.module#ImageModule',
            canLoad: [ACLGuard], data: { guard: <ACLType>{ ability: [aclAbility.review.view] } }
            // component: ImageComponent
          },
          {
            path: 'series', loadChildren: './manage/series/series.module#SeriesModule',
            canLoad: [ACLGuard], data: { guard: <ACLType>{ ability: [aclAbility.program.view] } }
          },
          {
            path: 'choreography', component: ChoreographyComponent,
            canActivate: [ACLGuard], data: { guard: <ACLType>{ ability: [aclAbility.editing.view] } },
            children: [
              { path: '', redirectTo: 'info', pathMatch: 'full' },
              {
                path: 'info',
                component: InfoComponent
              },
              {
                path: 'edit-broadcast-plan',
                component: EditBroadcastPlanComponent
              },
              {
                path: 'theatre',
                component: TheatreComponent
              },
            ]
          },
          {
            path: 'transmit', loadChildren: './manage/transmit/transmit.module#TransmitModule',
            canLoad: [ACLGuard], data: {
              guard: <ACLType>{
                ability: [
                  aclAbility.program.source.upload, aclAbility.program.source.download
                ]
              }
            }
          },
          { path: 'customers', loadChildren: './manage/customers/customers.module#CustomersModule' },
          // { path: 'contracts', loadChildren: './manage/contract.module#ContractModule' },
          {
            path: 'account-center', component: PersonalCenterComponent, data: { breadcrumb: 'Account' },
            children: [
              { path: 'history', component: BrowseRecordComponent, },
              { path: 'my-sharing', component: MySharingComponent, },
              {
                path: 'my-callup', component: MyCallupComponent,
                children: [
                  { path: '', redirectTo: 'my-samples', pathMatch: 'full' },
                  { path: 'my-samples', component: MySmplesComponent },
                  { path: 'samples-deails/:id', component: SmplesDetailsComponent, },
                ]
              },
            ]

          },
          { path: 'teams', loadChildren: './manage/teams/teams.module#TeamsModule' }
        ]
      }
    ]
  },
  { path: 'outside', loadChildren: './outside/outside.module#OutsideModule' },
  {
    path: 'passport',
    component: PassportComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent,
        children: [
          { path: '', redirectTo: 'phone', pathMatch: 'full' },
          { path: 'phone', component: PhoneLoginComponent },
          { path: 'wechat', component: WechatLoginComponent }
        ]
      },
      {
        path: 'binding',
        component: BindingComponent,
        children: [
          { path: 'phone', component: PhoneBindingComponent },
          { path: 'company', component: CompanyBindingComponent }
        ]
      }
    ]
  },
  {
    path: 'oauth2',
    loadChildren: '../oauth2/oauth2.module#Oauth2Module',
  },
  {
    path: 'auth',
    loadChildren: '../auth/auth.module#AuthModule',
  }
];

@NgModule({
  imports: [
    // 永远不要在特性路由模块中调用RouterModule.forRoot！
    RouterModule.forRoot(routes,
      // 只预加载那些data.preload标志为true的路由
      { preloadingStrategy: SelectivePreloadingStrategy })
  ],
  // 把RouterModule添加到路由模块的exports中，
  // 以便关联模块（比如AppModule）中的组件可以访问路由模块中的声明，
  // 比如RouterLink 和 RouterOutlet。
  exports: [RouterModule]
})
export class RouteRoutingModule { }
