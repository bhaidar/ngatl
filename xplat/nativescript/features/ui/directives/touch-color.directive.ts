import { Directive, ElementRef, Input, SimpleChanges } from '@angular/core';

// nativescript
import { Color } from 'tns-core-modules/color';
import { View } from 'tns-core-modules/ui/core/view';
import { Animation, AnimationDefinition } from 'tns-core-modules/ui/animation';
import { TouchGestureEventData } from 'tns-core-modules/ui/gestures';
import { isAndroid } from 'tns-core-modules/platform';

// libs
import { Subject } from 'rxjs';
import { WindowService, BaseComponent } from '@ngatl/core';
import { safeSplit } from '@ngatl/utils';

@Directive({
  selector: '[touchColor]'
})
export class TouchColorDirective extends BaseComponent {

  @Input() touchColor: string;
  @Input() touchColorDisableAndroid: boolean;
  @Input() touchColorId: any; // helps reset colors if used within RadListView/ListView with recycled rows

  private _baseBgColor: string; // base/default background color
  private _baseColor: string; // base/default text color
  private _highlightBgColor: string; // highlight background color on touch
  private _highlightColor: string; // highlight text color on touch
  private _currentBgColor: string; // currently active bg color
  private _currentColor: string; // currently active text color
  private _view: View;
  private _animation: Animation;
  private _viewInit = false;
  private _touchHandler: (args: TouchGestureEventData) => void;

  constructor(
    private _el: ElementRef,
    private _win: WindowService,
  ) {
    super();
    this._touchHandler = this._touchHandlerFn.bind(this);
  }

  ngOnInit() {
    if (this.touchColor) {
      let parts: Array<string>;
      if (this.touchColor.indexOf('rgb') > -1) {
        parts = safeSplit(this.touchColor, '),');
      } else {
        parts = safeSplit(this.touchColor, ',');
      }
      if (parts.length > 1) {
        this._baseBgColor = parts[0].trim();
        this._currentBgColor = this._baseBgColor;
        this._highlightBgColor = parts[1].trim();

        if (parts.length === 4) {
          // also including text color changes
          this._baseColor = parts[2].trim();
          this._highlightColor = parts[3].trim();
        }
      }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.touchColorId && changes.touchColorId.currentValue !== changes.touchColorId.previousValue) {
      // reset if being recycled in a RadListView/ListView
      this._changeStyle(this._baseBgColor, this._baseColor, true);
    }
  }

  ngAfterViewInit() {
    if (this.touchColorDisableAndroid && isAndroid) {
      return;
    }
    if (!this._view && this._el && this._el.nativeElement) {
      this._view = this._el.nativeElement;
    }
    if (this._view && this._baseBgColor && !this._animation) {
      this._view.on('touch', this._touchHandler);

      // setup fade out
      const animateOptions: AnimationDefinition = {
        backgroundColor: this._platformColor(this._baseBgColor),
        duration: 400,
        iterations: 1,
        target: this._view
      };

      this._animation = new Animation([animateOptions]);
    }

  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this._cancel();
    if (this._view) {
      this._view.off('touch', this._touchHandler);
    }
  }

  private _touchHandlerFn(args: TouchGestureEventData) {
    switch (args.action) {
      case 'down':
        // highlight
        this._changeStyle(this._highlightBgColor, this._highlightColor);
        break;
      case 'cancel':
      case 'up':
        this._play(); // fade out color change
        this._revertTextColor();
        break;
    }
  }

  private _revertTextColor() {
    if (this._view && this._baseColor) {
      this._view.color = this._platformColor(this._baseColor);
    }
  }

  private _resetActiveColors() {
    // reset active bg class
    this._currentBgColor = this._baseBgColor;
    this._currentColor = this._baseColor;
  }

  private _platformColor(color: string): Color {
    // support various syntax
    if (color === 'transparent') {
      return new Color(0, 0, 0, 0);
    } else if (color) {
      if (color.indexOf('rgb') === 0) {
        const colorCodes = color.replace('rgb(', '').replace('rgba(', '').replace(')', '').split(',').map(i => +i);
        // console.log(colorCodes);
        const alpha = colorCodes[colorCodes.length-1];
        colorCodes.splice(-1, 1);
        // console.log('colorcodes:', alpha, colorCodes[0], colorCodes[1], colorCodes[2]);
        return new Color(alpha, colorCodes[0], colorCodes[1], colorCodes[2]);
      } else {
        return new Color(color);
      }
    }
    // TODO: the text color being passed for the names on creations is falsy, and returning null here seems to resolve it right
    // probably because of scrollview/iOS/safeArea rebinding, since different parts of the scrollable area behave differently here.
    return null;
  }

  private _changeStyle(
    bgColor: string,
    color: string,
    force?: boolean
  ) {
    if (this._view) {
      // if changing style again, ensure animation is canceled if one had started (ie, doubletap can cause this)
      this._cancel();

      if (force || (bgColor && bgColor !== this._currentBgColor)) {
        // avoid changing native props unless they are truly different
        this._currentBgColor = bgColor;
        this._view.backgroundColor = this._platformColor(bgColor);
      }
      if (force || (color && color !== this._currentColor)) {
        this._currentColor = color;
        this._view.color = this._platformColor(color);
      }
    }
  }

  private _cancel() {
    if (this._animation && this._animation.isPlaying) {
      this._animation.cancel();
    }
  }

  private _play() {
    this._cancel(); // cancel if currently playing to replay

    if (this._animation) {
      this._animation.play().then(_ => {
        this._resetActiveColors();
      }, (err) => {
        this._resetActiveColors();
        // also need this here to prevent:
        // Unhandled Promise rejection: Animation cancelled. ; Zone: <root> ; Task: null ; Value: Error: Animation cancelled. _rejectAnimationFinishedPromise@file:///app/tns_modules/tns-core-modules/ui/animation/animation-common.js:98:31 [<root>]
      });
    }
  }
}
