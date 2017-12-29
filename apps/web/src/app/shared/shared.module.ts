import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// libs
import { MatSidenavModule } from '@angular/material';

// app
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { FooterComponent } from './footer/footer.component';
import { PillButtonComponent } from './pill-button/pill-button.component';
import { SpeakerCardComponent } from './speaker-card/speaker-card.component';

const MODULES = [CommonModule, FormsModule, RouterModule, MatSidenavModule];

const COMPONENTS = [BreadcrumbComponent, FooterComponent, PillButtonComponent, SpeakerCardComponent];

@NgModule({
  imports: [...MODULES],
  declarations: [...COMPONENTS],
  exports: [...MODULES, ...COMPONENTS]
})
export class SharedModule {}
