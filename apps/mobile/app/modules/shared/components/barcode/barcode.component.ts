import { Component } from '@angular/core';
import { BarcodeScanner } from "nativescript-barcodescanner";
import { ModalDialogParams } from 'nativescript-angular/directives/dialogs';

@Component( {
  moduleId: module.id,
  selector: 'app-barcode',
  templateUrl: './barcode.component.html'
})
export class BarcodeComponent {
  public title = 'Barcode Scanner';
  private _barcode: BarcodeScanner;

  constructor(
    public params: ModalDialogParams,
  ) {
    this._barcode = new BarcodeScanner();
  }

  ngAfterViewInit() {
    this._openScanner();
  }

  private _openScanner() {
    this._barcode.hasCameraPermission().then( ( granted: boolean ) => {
      console.log( 'granted:', granted );
      if ( granted ) {
        this._barcode.available().then( ( avail: boolean ) => {
          if ( avail ) {
            this._barcode.scan( {
              formats: "QR_CODE,PDF_417,EAN_13",   // Pass in of you want to restrict scanning to certain types
              cancelLabel: "EXIT. Also, try the volume buttons!", // iOS only, default 'Close'
              cancelLabelBackgroundColor: "#333333", // iOS only, default '#000000' (black)
              message: "Use the volume buttons for extra light", // Android only, default is 'Place a barcode inside the viewfinder rectangle to scan it.'
              showFlipCameraButton: true,   // default false
              preferFrontCamera: false,     // default false
              showTorchButton: true,        // default false
              beepOnScan: true,             // Play or Suppress beep on scan (default true)
              torchOn: false,               // launch with the flashlight on (default false)
              closeCallback: () => {
                console.log( "Scanner closed" );
              }, // invoked when the scanner was closed (success or abort)
              resultDisplayDuration: 500,   // Android only, default 1500 (ms), set to 0 to disable echoing the scanned text
              orientation: "landscape",     // Android only, optionally lock the orientation to either "portrait" or "landscape"
              openSettingsIfPermissionWasPreviouslyDenied: true // On iOS you can send the user to the settings app if access was previously denied
            } ).then( ( result ) => {
              console.log( 'result:', result );
              if ( result ) {
                console.log( "Scan format: " + result.format );
                console.log( "Scan text:   " + result.text );
              }
            }, ( err ) => {
              console.log( 'error:', err );
            } );
          }
        } );
      } else {
        this._barcode.requestCameraPermission().then( () => {
          this._openScanner();
        } );
      }
    } );
  }
}
