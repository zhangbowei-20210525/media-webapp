import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SelectivePreloadingStrategy } from '../core';
import { LayoutComponent } from '../layout/layout.component';
import { MarketComponent } from './market/market.component';
import { ManageComponent } from './manage/manage.component';
import { DashboardComponent } from './manage/dashboard/dashboard.component';
import { PersonalCenterComponent } from './manage/personal-center/personal-center.component';
import { SimpleGuard } from '@delon/auth';
import { SeriesComponent } from './manage/series/series.component';
import { BrowseRecordComponent } from './manage/personal-center/browse-record/browse-record.component';
import { MarketDetailsComponent } from './market/market-details/market-details.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    data: { breadcrumb: 'Home' },
    children: [
      {
        path: 'market',
        component: MarketComponent,
      },
      { path: 'd/:id', component: MarketDetailsComponent },
      {
        path: 'manage',
        component: ManageComponent,
        data: { breadcrumb: 'Manage' },
        canActivate: [SimpleGuard],
        children: [
          { path: '', redirectTo: 'series', pathMatch: 'full' },
          {
            path: 'dashboard',
            component: DashboardComponent
          },
          { path: 'series', loadChildren: './manage/series/series.module#SeriesModule' },
          { path: 'transmit', loadChildren: './manage/transmit/transmit.module#TransmitModule' },
          { path: 'customers', loadChildren: './manage/customers/customers.module#CustomersModule' },
          // { path: 'contracts', loadChildren: './manage/contract.module#ContractModule' },
          {
            path: 'account-center', component: PersonalCenterComponent, data: { breadcrumb: 'Account' },
            children: [
              { path: 'history', component: BrowseRecordComponent, },
            ]
          },
          { path: 'teams', loadChildren: './manage/teams/teams.module#TeamsModule' }
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
