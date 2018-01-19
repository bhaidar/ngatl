import { NSAppService } from './ns-app.service';
import { TNSModalService } from './tns-modal.service';
import { TNSStorageService } from './tns-storage.service';
import { MobileWindowPlatformService } from './tns-window.service';
import { DrawerService } from './drawer.service';
import { TnsHttpErrorService } from './tns-http-error.service';
import { RecordService } from './record.service';
import { AWSService } from './aws.service';

export const CORE_PROVIDERS: any[] = [
  TNSModalService,
  DrawerService,
  NSAppService,
  TNSStorageService,
  TnsHttpErrorService,
  MobileWindowPlatformService,
  RecordService,
  AWSService,
];

export * from './drawer.service';
export * from './ns-app.service';
export * from './tns-modal.service';
export * from './tns-storage.service';
export * from './tns-http-error.service';
export * from './tns-window.service';
