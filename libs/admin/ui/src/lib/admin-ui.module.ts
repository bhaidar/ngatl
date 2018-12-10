import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout'

import { AdminUiFormsModule } from './admin-ui-forms.module'
import { AdminUiMaterialModule } from './admin-ui-material.module';

import { CardComponent } from './components/card/card.component';
import { FormComponent } from './components/form/form.component';
import { FormRepeatComponent } from './components/form-repeat/form-repeat.component';
import { GridComponent } from './components/grid/grid.component';
import { GridTemplateDirective } from './components/grid/grid-template.directive';
import { LayoutComponent } from './components/layout/layout.component';
import { ModalConfirmComponent } from './components/modal-confirm/modal-confirm.component'
import { ModalFormComponent } from './components/modal-form/modal-form.component';

const ENTRY_COMPONENTS = [
  ModalConfirmComponent,
  ModalFormComponent,
]
const COMPONENTS = [
  ...ENTRY_COMPONENTS,
  CardComponent,
  FormComponent,
  FormRepeatComponent,
  FormComponent,
  GridComponent,
  GridTemplateDirective,
  LayoutComponent
]

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    RouterModule,
    AdminUiFormsModule,
    AdminUiMaterialModule,
  ],
  declarations: [
    ...COMPONENTS,
  ],
  exports: [
    ...COMPONENTS,
    AdminUiMaterialModule
  ],
  entryComponents: [
    ...ENTRY_COMPONENTS
  ]
})
export class AdminUiModule {}
