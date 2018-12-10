
import { View } from "tns-core-modules/ui/core/view";
import { Color } from "tns-core-modules/color";
import * as platform from "tns-core-modules/platform";

export namespace LinearGradient {
    export enum Orientation {
        TopLeft_BottomRight,
        Left_Right,
        BottomLeft_TopRight,
        Bottom_Top,
        BottomRight_TopLeft,
        Right_Left,
        TopRight_BottomLeft,
        Top_Bottom
    }

    export function drawBackground( view: View, colors: Array<Color>, orientation?: Orientation ) {
      const nativeView = ( <any>view ).nativeView;
        if ( !nativeView ) {
            throw new Error( "Native view is not created yet!" );
        }

        if ( platform.isIOS ) {
          const gradientLayer = CAGradientLayer.layer();
          const nativeColors = NSMutableArray.alloc().initWithCapacity( colors.length );

            colors.forEach( function ( color: Color ) {
                nativeColors.addObject( color.ios.CGColor );
            } );
            gradientLayer.colors = nativeColors;

            gradientLayer.frame = nativeView.bounds;
            setStartAndEndPoints( gradientLayer, orientation );
            nativeView.layer.insertSublayerAtIndex( gradientLayer, 0 );
        } else {
            let backgroundDrawable = nativeView.getBackground();
            if ( !( backgroundDrawable instanceof android.graphics.drawable.GradientDrawable ) ) {
                backgroundDrawable = new android.graphics.drawable.GradientDrawable();
                nativeView.setBackgroundDrawable( backgroundDrawable );
            }

            const LINEAR_GRADIENT = 0;
            const nativeColors = new Array<number>();
            colors.forEach( function ( color: Color ) {
                nativeColors.push( color.android );
            } );
            backgroundDrawable.setColors( nativeColors );
            backgroundDrawable.setGradientType( LINEAR_GRADIENT );
            const androidOrientation = getAndroidOrientation( orientation );
            if ( androidOrientation ) {
                backgroundDrawable.setOrientation( androidOrientation );
            }
        }
    }

    function getAndroidOrientation( orientation?: Orientation ) {
        switch ( orientation ) {
            case Orientation.TopLeft_BottomRight:
                return android.graphics.drawable.GradientDrawable.Orientation.TL_BR;
            case Orientation.Left_Right:
                return android.graphics.drawable.GradientDrawable.Orientation.LEFT_RIGHT;
            case Orientation.BottomLeft_TopRight:
                return android.graphics.drawable.GradientDrawable.Orientation.BL_TR;
            case Orientation.Bottom_Top:
                return android.graphics.drawable.GradientDrawable.Orientation.BOTTOM_TOP;
            case Orientation.BottomRight_TopLeft:
                return android.graphics.drawable.GradientDrawable.Orientation.BR_TL;
            case Orientation.Right_Left:
                return android.graphics.drawable.GradientDrawable.Orientation.RIGHT_LEFT;
            case Orientation.TopRight_BottomLeft:
                return android.graphics.drawable.GradientDrawable.Orientation.TR_BL;
            case Orientation.Top_Bottom:
                return android.graphics.drawable.GradientDrawable.Orientation.TOP_BOTTOM;
        }
    }

    function setStartAndEndPoints(gradientLayer: CAGradientLayer, orientation?: Orientation){
        switch (orientation) {
           case Orientation.TopLeft_BottomRight:
               gradientLayer.startPoint =  CGPointMake(0, 0);
               gradientLayer.endPoint   =  CGPointMake(1, 1);
               break;
           case Orientation.Left_Right:
               gradientLayer.startPoint =  CGPointMake(0, 0.5);
               gradientLayer.endPoint   =  CGPointMake(1, 0.5);
               break;
           case Orientation.BottomLeft_TopRight:
               gradientLayer.startPoint =  CGPointMake(0, 1);
               gradientLayer.endPoint   =  CGPointMake(1, 0);
               break;
           case Orientation.Bottom_Top:
               gradientLayer.startPoint =  CGPointMake(0.5, 1);
               gradientLayer.endPoint   =  CGPointMake(0.5, 0);
               break;
           case Orientation.BottomRight_TopLeft:
               gradientLayer.startPoint =  CGPointMake(1, 1);
               gradientLayer.endPoint   =  CGPointMake(0, 0);
               break;
           case Orientation.Right_Left:
               gradientLayer.startPoint =  CGPointMake(1, 0.5);
               gradientLayer.endPoint   =  CGPointMake(0, 0.5);
               break;
           case Orientation.TopRight_BottomLeft:
               gradientLayer.startPoint =  CGPointMake(1, 0);
               gradientLayer.endPoint   =  CGPointMake(0, 1);
               break;
           case Orientation.Top_Bottom:
               gradientLayer.startPoint =  CGPointMake(0.5, 0);
               gradientLayer.endPoint   =  CGPointMake(0.5, 1);
               break;
       }
   }
}