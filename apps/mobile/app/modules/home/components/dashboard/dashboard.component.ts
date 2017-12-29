import {
  Component,
  AfterViewInit,
  OnInit,
  NgZone,
  ViewChild,
  ElementRef,
  ViewContainerRef,
  OnDestroy
} from '@angular/core';

// libs
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { SystemUser } from '@ngatl/api';
import { UserActions, ModalActions, WindowService } from '@ngatl/core';

// nativescript
import { BarcodeScanner } from "nativescript-barcodescanner";

// app
import { BarcodeComponent } from '../../../shared/components/barcode/barcode.component';

@Component({
  moduleId: module.id,
  selector: 'dashboard',
  templateUrl: 'dashboard.component.html'
})
export class DashboardComponent implements AfterViewInit, OnInit, OnDestroy {
  public user: any;
  private _barcode: BarcodeScanner;

  constructor(
    private _store: Store<any>,
    private _vcRef: ViewContainerRef,
    private _win: WindowService,
  ) { }

  public openBarcode() {
    this._barcode = new BarcodeScanner();
    this._openScanner();
  }

  public login() {
    this._store.dispatch(new UserActions.LoginAction(this.user));
  }

  public create() {
    // this._store.dispatch(new UserActions.CreateAction(this.user));
    const user = new SystemUser( this.user );
    for ( const key in user ) {
      console.log( key, user[key] );
    }
    this._store.dispatch(new UserActions.CreateFinishAction(user));
  }

  ngOnInit() {
    this.user = {
      firstName: 'Any',
      lastName: 'User',
      username: 'user@ngatl.org',
      email: 'user@ngatl.org',
      password: '12341234'
    };
  }

  ngAfterViewInit() {}

  ngOnDestroy() { }

  private _openScanner(requestPerm: boolean = true) {
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
                this._barcode = null;
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
      } else if (requestPerm) {
        this._barcode.requestCameraPermission().then( () => {
          this._openScanner(false); // prevent loop on
        } );
      } else {
        this._win.alert( 'Please enable camera permissions in your device settings.' );
      }
    } );
  }
}
