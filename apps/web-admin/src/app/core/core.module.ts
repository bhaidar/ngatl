import { NgModule } from '@angular/core';

// xplat
import { NgatlCoreModule } from '@ngatl/web';
import { AdminUiModule } from '@ngatl/admin/ui'

import { DashboardComponent } from './dashboard/dashboard.component'

@NgModule({
  imports: [NgatlCoreModule, AdminUiModule],
  declarations: [DashboardComponent],
  exports: [DashboardComponent],
})
export class CoreModule {}
