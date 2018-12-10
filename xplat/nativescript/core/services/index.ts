import { AppService } from './app.service';
import { DrawerService } from './drawer.service';
import { ImageCacheService } from './image-cache.service';
import { TNSModalService } from './tns-modal.service';
import { TNSWindowService } from './tns-window.service';
import { TNSStorageService } from './tns-storage.service';
import { AWSService } from './aws.service';

export const PROVIDERS: any[] = [AppService, DrawerService, ImageCacheService, TNSModalService, TNSStorageService, TNSWindowService, AWSService];

export * from './app.service';
export * from './color.service';
export * from './drawer.service';
export * from './image-cache.service';
export * from './aws.service';
