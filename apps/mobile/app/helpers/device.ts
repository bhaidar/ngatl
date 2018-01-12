import { isIOS, device, screen } from 'tns-core-modules/platform';

export function iOSProperty( _this, property ) {
  if ( typeof property === "function" ) {
    return property.call( _this );
  }
  else {
    return property;
  }
}

export function getContext() {
  let ctx = java.lang.Class.forName( "android.app.AppGlobals" ).getMethod( "getInitialApplication", null ).invoke( null, null );
  if ( ctx ) { return ctx; }

  return java.lang.Class.forName( "android.app.ActivityThread" ).getMethod( "currentApplication", null ).invoke( null, null );
}

export function getResolution( v?: any ) {
  if ( isIOS ) {
    const screen = iOSProperty( UIScreen, UIScreen.mainScreen );
    return {
      width: screen.bounds.size.width,
      height: screen.bounds.size.height,
      scale: screen.scale,
      widthPixels: screen.bounds.size.width * screen.scale,
      heightPixels: screen.bounds.size.height * screen.scale,
    };
  } else {
    const context = getContext();
    const metrics = new android.util.DisplayMetrics();
    if ( v === false ) {
      context.getSystemService( android.content.Context.WINDOW_SERVICE ).getDefaultDisplay().getMetrics( metrics );
    } else {
      context.getSystemService( android.content.Context.WINDOW_SERVICE ).getDefaultDisplay().getRealMetrics( metrics );
    }

    return {
      width: parseInt( <any>( metrics.widthPixels / metrics.density ), 10 ),
      height: parseInt( <any>( metrics.heightPixels / metrics.density ), 10 ),
      scale: metrics.density,
      widthPixels: metrics.widthPixels,
      heightPixels: metrics.heightPixels

    }
  }
}