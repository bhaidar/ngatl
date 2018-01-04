import { ActionBarBackComponent } from './action-bar/action-bar-back.component';
import { ActionBarComponent } from './action-bar/action-bar.component';
import { ModalTitleBarComponent } from './modal-title-bar/modal-title-bar.component';
import { NSWebViewComponent } from './ns-webview/ns-webview.component';
import { BarcodeComponent } from './barcode/barcode.component';
import {
  InlineHtmlComponent,
  InlineHtmlLabelComponent,
  InlineHtmlLinkableLabelComponent,
} from './inline-html/inline-html.component';

export const SHARED_COMPONENTS: any[] = [
  ActionBarBackComponent, 
  ActionBarComponent, 
  ModalTitleBarComponent, 
  BarcodeComponent,
  InlineHtmlComponent,
  InlineHtmlLabelComponent,
  InlineHtmlLinkableLabelComponent,
];

export const SHARED_ENTRY_COMPONENTS: any[] = [NSWebViewComponent, BarcodeComponent];
