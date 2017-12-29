import { ActionBarBackComponent } from './action-bar/action-bar-back.component';
import { ActionBarComponent } from './action-bar/action-bar.component';
import { ModalTitleBarComponent } from './modal-title-bar/modal-title-bar.component';
import { NSWebViewComponent } from './ns-webview/ns-webview.component';
import { BarcodeComponent } from './barcode/barcode.component';

export const SHARED_COMPONENTS: any[] = [ActionBarBackComponent, ActionBarComponent, ModalTitleBarComponent, BarcodeComponent];

export const SHARED_ENTRY_COMPONENTS: any[] = [NSWebViewComponent, BarcodeComponent];
