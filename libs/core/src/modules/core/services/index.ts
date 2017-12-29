import { ApiService } from './api.service';
import { WindowService } from './window.service';
import { StorageService } from './storage.service';
import { LogService } from './log.service';
import {
  ModalPlatformService,
  ModalService,
} from './modal.service';
import {
  PlatformLoaderService,
  ProgressService,
} from './progress.service';
import { LocaleService } from './locale.service';
import { HttpErrorService } from './http-error.service';
import { FilterService } from './filter.service';
import { NetworkCommonService } from './network.service';

export const CORE_PROVIDERS: any[] = [
  ApiService,
  WindowService,
  StorageService,
  LogService,
  LocaleService,
  ModalPlatformService,
  ModalService,
  PlatformLoaderService,
  ProgressService,
  HttpErrorService,
  FilterService,
  NetworkCommonService,
];

export * from './api.service';
export * from './window.service';
export * from './storage.service';
export * from './log.service';
export * from './locale.service';
export * from './modal.service';
export * from './progress.service';
export * from './http-error.service';
export * from './filter.service';
export * from './network.service';
export * from './http.service';
