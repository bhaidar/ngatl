import { NgModule } from '@angular/core';

// xplat
import { UIModule } from '@ngatl/web';
import { RouterModule } from '@angular/router'

const MODULES = [UIModule, RouterModule];

@NgModule({
  imports: [...MODULES],
  exports: [...MODULES]
})
export class SharedModule {}
