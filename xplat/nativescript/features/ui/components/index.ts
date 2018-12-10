import { HeaderComponent } from './header/header.component';
import { ActionBarBackComponent } from './action-bar/action-bar-back.component';
import { ActionBarComponent } from './action-bar/action-bar.component';
import { ModalTitleBarComponent } from './modal-title-bar/modal-title-bar.component';
import { NSWebViewComponent } from './ns-webview/ns-webview.component';
import { BarcodeComponent } from './barcode/barcode.component';
import { HelpComponent } from './help/help.component';
import {
  InlineHtmlComponent,
  InlineHtmlLabelComponent,
  InlineHtmlLinkableLabelComponent,
} from './inline-html/inline-html.component';
import { CameraModalComponent } from './camera-modal/camera-modal.component';
import { PictureComponent } from './picture/picture.component';
// import { NoteEditComponent } from './note-edit/note-edit.component';
import { SelectModalComponent } from './select/select.component';
import { ViewPhotoComponent } from './view-photo/view-photo.component';

export const UI_COMPONENTS = [
  HeaderComponent,
  ActionBarBackComponent, 
  ActionBarComponent, 
  ModalTitleBarComponent, 
  BarcodeComponent,
  InlineHtmlComponent,
  InlineHtmlLabelComponent,
  InlineHtmlLinkableLabelComponent,
  HelpComponent,
  CameraModalComponent,
  PictureComponent,
  // NoteEditComponent,
  SelectModalComponent,
  ViewPhotoComponent,
];

export const UI_ENTRY_COMPONENTS: any[] = [NSWebViewComponent, BarcodeComponent, HelpComponent, CameraModalComponent, SelectModalComponent, ViewPhotoComponent];//NoteEditComponent
