import { Directive, ElementRef, Input, SimpleChanges } from '@angular/core';

// nativescript
import { Color } from 'tns-core-modules/color';
import { View } from 'tns-core-modules/ui/core/view';
import { Animation, AnimationDefinition } from 'tns-core-modules/ui/animation';
import { TouchGestureEventData } from 'tns-core-modules/ui/gestures';

// libs
import { Subject } from 'rxjs/Subject';
import { WindowService, BaseComponent, safeSplit } from '@ngatl/core';

@Directive({
  selector: '[touchColor]'
})
export class TouchColorDirective extends BaseComponent {

  @Input() touchColor: string;

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
      const parts = safeSplit(this.touchColor, ',');
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

  ngAfterViewInit() {
    if (!this._view && this._el && this._el.nativeElement) {
      this._view = this._el.nativeElement;
    }
    if (this._view && this._baseBgColor && !this._animation) {
      this._view.on('touch', this._touchHandler);

      // setup fade out
      let animateOptions: AnimationDefinition = {
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
    switch ( args.action ) {
      case 'down':
        // highlight
        this._cancel();
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
    if ( this._view && this._baseColor) {
      this._view.color = this._platformColor(this._baseColor);
    }
  }

  private _resetActiveColors() {
    // reset active bg class
    this._currentBgColor = this._baseBgColor;
    this._currentColor = this._baseColor;
  }

  private _platformColor(color: string) {
    // support various syntax
    if (color === 'transparent') {
      return new Color(0, 0, 0, 0);
    } else if (color.indexOf('-') > -1) {
      // rgb or rgba
      const parts = color.split('-');
      if (parts.length === 4) {
        // supports alpha
        return new Color(parseInt(parts[4], 10), parseInt(parts[0], 10), parseInt(parts[1], 10), parseInt(parts[2], 10));
      } else if (parts.length === 3) {
        // default fully opaque
        return new Color(100, parseInt(parts[0], 10), parseInt(parts[1], 10), parseInt(parts[2], 10));
      }
    } else {
      return new Color(color);
    }
  }

  private _changeStyle(
    bgColor: string,
    color: string,
  ) {
    if (this._view) {
      if (bgColor && bgColor !== this._currentBgColor) {
        // avoid changing native props unless they are truly different
        this._currentBgColor = bgColor;
        this._view.backgroundColor = this._platformColor(bgColor);
      }
      if (color && color !== this._currentColor) {
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
