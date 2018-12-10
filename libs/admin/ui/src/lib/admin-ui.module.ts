import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout'

import { MATERIAL_COMPONENTS } from './admin-ui-material.module';

import { CardComponent } from './components/card/card.component';
import { GridComponent } from './components/grid/grid.component';
import { GridTemplateDirective } from './components/grid/grid-template.directive';
import { LayoutComponent } from './components/layout/layout.component';
import { ModalConfirmComponent } from './components/modal-confirm/modal-confirm.component'
import { ModalFormComponent } from './components/modal-form/modal-form.component';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    RouterModule,
    ...MATERIAL_COMPONENTS,
  ],
  declarations: [
    LayoutComponent,
    ModalConfirmComponent,
    ModalFormComponent,
    CardComponent,
    GridComponent,
    GridTemplateDirective
  ],
  exports: [
    LayoutComponent,
    ModalConfirmComponent,
    ModalFormComponent,
    CardComponent,
    GridComponent,
    GridTemplateDirective,
    ...MATERIAL_COMPONENTS
  ],
  entryComponents: [ModalConfirmComponent, ModalFormComponent]
})
export class AdminUiModule {}
