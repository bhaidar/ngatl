import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { Routes } from '@angular/router';

import { SharedModule } from '../../features/shared/shared.module';
import { NOTES_COMPONENTS, NoteEditComponent } from './components';

const routes: Routes = [
  {
    path: ':id',
    component: NoteEditComponent
  },
];

@NgModule({
  imports: [SharedModule, NativeScriptRouterModule.forChild(routes)],
  declarations: [...NOTES_COMPONENTS],
  schemas: [NO_ERRORS_SCHEMA]
})
export class NotesModule {}
