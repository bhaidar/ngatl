import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'

import { LayoutComponent } from './components/layout/layout.component'

import { MATERIAL_COMPONENTS } from './admin-ui-material.module'

@NgModule({
  imports: [CommonModule, RouterModule, ...MATERIAL_COMPONENTS],
  declarations: [LayoutComponent],
  exports: [LayoutComponent, ...MATERIAL_COMPONENTS],
})
export class AdminUiModule {}
