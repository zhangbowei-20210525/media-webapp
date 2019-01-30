import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SelectivePreloadingStrategy } from '../core';
import { LayoutComponent } from '../layout/layout.component';
import { MarketComponent } from './market/market.component';
import { ManageComponent } from './manage/manage.component';
import { DashboardComponent } from './manage/dashboard/dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'market',
        component: MarketComponent
      },
      {
        path: 'manage',
        component: ManageComponent,
        children: [
          {
            path: 'dashboard',
            component: DashboardComponent
          },
          { path: 'series', loadChildren: './manage/series/series.module#SeriesModule' },
           // { path: 'transmission', loadChildren: './manage/series.module#SeriesModule' },
          // { path: 'customers', loadChildren: './manage/customer.module#CustomerModule' },
          // { path: 'contracts', loadChildren: './manage/contract.module#ContractModule' },
          // { path: 'personal-center', loadChildren: './manage/personal-center.module#PersonalCenterModule' },
          // { path: 'teams', loadChildren: './manage/team.module#TeamModule' }
        ]
      }
    ]
  },
  {
    path: 'oauth2',
    loadChildren: '../oauth2/oauth2.module#Oauth2Module',
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