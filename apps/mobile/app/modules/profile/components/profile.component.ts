import {
  Component,
  AfterViewInit,
  OnInit,
  ViewContainerRef
} from '@angular/core';

// libs
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

// nativescript
import { RouterExtensions } from 'nativescript-angular/router';
import { Color } from 'tns-core-modules/color';
import { View } from 'tns-core-modules/ui/core/view';
import { isIOS, platformNames, device } from 'tns-core-modules/platform';

// app
// import { LoggerService } from '@ngatl/api';
import {
  LogService,
  IAppState,
  UserState,
  ModalActions,
  ModalState,
  BaseComponent,
  UserActions,
  WindowService,
  UserService,
  ProgressService,
  LocaleActions,
  LocaleState,
} from '@ngatl/core';
import { NSAppService } from '../../core/services/ns-app.service';
import { LinearGradient } from '../../../helpers';
import { SelectModalComponent, ISelectItem } from '../../shared/components/select/select.component';

@Component({
  moduleId: module.id,
  selector: 'ngatl-ns-profile',
  templateUrl: 'profile.component.html'
})
export class ProfileComponent extends BaseComponent
  implements AfterViewInit, OnInit {
  public currentUser: UserState.IRegisteredUser;
  public userLanguage: string;
  private _langItems = [
    {
      name: 'English',
      value: 'en'
    },
    {
      name: 'Spanish',
      value: 'es'
    },
    {
      name: 'Russian',
      value: 'ru'
    },
    {
      name: 'Chinese',
      value: 'zh'
    },
  ];

  constructor(
    private store: Store<any>,
    private router: RouterExtensions,
    private log: LogService,
    private win: WindowService,
    private translate: TranslateService,
    private vcRef: ViewContainerRef,
    private userService: UserService,
    private progress: ProgressService,
    private appService: NSAppService,
  ) {
    super();
    this.appService.currentVcRef = this.vcRef;
  }

  public openLang() {
    const langItems: Array<ISelectItem> = [...this._langItems];
    const currentLang = this.currentUser.language || 'en';
    for (const item of langItems) {
      item.selected = currentLang === item.value;
    }
    this.store.dispatch(new ModalActions.OpenAction({
      cmpType: SelectModalComponent,
      modalOptions: {
        viewContainerRef: this.vcRef,
        context: {
          title: this.translate.instant('user.language'),
          name: 'profile',
          items: langItems
        }
      }
    }))
  }

  public logout() {
    this.store.dispatch(new UserActions.LogoutAction());
    this.win.setTimeout(_ => {
      this.router.back();
    }, 300);
  }

  public unclaim() {
    this.win.confirm(this.translate.instant('user.unclaim-confirm'), () => {
      this._confirmUnclaim();
    }).then(_ => {

    }, _ => {

    });
  }

  private _confirmUnclaim() {
    this.store.dispatch(new UserActions.UnclaimUserAction(this.userService.badgeId));
    this.win.setTimeout(_ => {
      this.router.back();
    }, 300);
  }

  public onBackgroundLoaded(args) {
    let background = <View>args.object;
    let colors = new Array<Color>(new Color("#151F2F"), new Color("#fff"));
    let orientation = LinearGradient.Orientation.Top_Bottom;

    switch (device.os) {
        case platformNames.android:
        LinearGradient.drawBackground(background, colors, orientation);
            break;
        case platformNames.ios:
            // The iOS view has to be sized in order to apply a background
            setTimeout(() => {
              LinearGradient.drawBackground(background, colors, orientation);
            });
            break;
    }
  }

  public onContentLoaded(e) {

  }

  public onTextInputTapped(e) {

  }

  public save() {
    // for (const key in this.currentUser) {
    //   this.log.debug(key, this.currentUser[key]);
    // }
    this.progress.toggleSpinner(true);
    this.store.dispatch(new UserActions.UpdateAction(this.currentUser));
    this.win.setTimeout(_ => {
      this.progress.toggleSpinner(false);
      this.win.alert(this.translate.instant('user.updated'));
    }, 1500);
  }

  ngOnInit() {
    // this.currentUser = new UserState.RegisteredUser(
    //   {
    //     name: 'Nathan Walker',
    //     phone: '5038106104'
    //   }
    // );
    this.store
      .select((s: IAppState) => s.user)
      .takeUntil(this.destroy$)
      .subscribe((s: UserState.IState) => {
        // clone so user can make editing changes to bindings
        this.currentUser = new UserState.RegisteredUser(
          Object.assign({}, s.current)
        );
        if (!this.currentUser.language) {
          this.currentUser.language = 'en';
        }
        this._updateLangLabel();
      });

    this.store.select( ( s: IAppState ) => s.ui.modal )
      .takeUntil( this.destroy$ )
      .subscribe( ( state: ModalState.IState ) => {
        if (state.latestResult && state.latestResult.name === 'profile') {
          this.currentUser.language = <LocaleState.Locale>state.latestResult.selection.value;
          this.store.dispatch(new LocaleActions.SetAction(this.currentUser.language));
          this._updateLangLabel();

          // reset
          this.store.dispatch( new ModalActions.ClosedAction( {
            open: false,
            latestResult: null,
          } ) );
        }
      } );
  }

  private _updateLangLabel() {
    for (const item of this._langItems) {
      if (this.currentUser.language === item.value) {
        this.userLanguage = item.name;
        break;
      }
    }
  }

  ngAfterViewInit() {}
}
