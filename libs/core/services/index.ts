import { LogService } from './log.service';
import { EventBusService } from './event-bus.service';
import { WindowService } from './window.service';
import { AnalyticsService } from './analytics.service';
import { StorageService } from './storage.service';
import { LocaleService } from './locale.service';
import { ModalPlatformService, ModalService } from './modal.service';
import { PlatformLoaderService, ProgressService } from './progress.service';
import { UserService } from './user.service';

export const CORE_PROVIDERS: any[] = [LogService, LocaleService, EventBusService, WindowService, AnalyticsService, ModalPlatformService, ModalService, StorageService, PlatformLoaderService,
  ProgressService,
  UserService];

export * from './log.service';
export * from './event-bus.service';
export * from './window.service';
export * from './tokens';
export * from './analytics.service';
export * from './modal.service';
export * from './event-bus.service';
export * from './storage.service';
export * from './locale.service';
export * from './progress.service';
export * from './user.service';
