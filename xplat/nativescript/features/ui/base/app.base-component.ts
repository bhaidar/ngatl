import { Component } from '@angular/core';

// libs
import { BaseComponent } from '@ngatl/core';
import { AppService } from '@ngatl/nativescript/core';

export abstract class AppBaseComponent extends BaseComponent {
  constructor(protected appService: AppService) {
    super();
  }
}
