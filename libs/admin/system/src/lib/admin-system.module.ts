import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminUiModule } from '@ngatl/admin/ui'

import { UsersIndexComponent } from './components/users-index/users-index.component'

const routes = [
  {path: '', pathMatch: 'full', redirectTo: 'users' },
  {path: 'users', component: UsersIndexComponent, },
]
@NgModule({
  imports: [
    CommonModule,
    AdminUiModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    UsersIndexComponent,
  ]
})
export class AdminSystemModule {}
