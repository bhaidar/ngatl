const splashPlugin = require('nativescript-splashscreen');

let FRESH_LAUNCH: boolean = true;

export class CustomAppDelegate extends UIResponder implements UIApplicationDelegate {
    public static ObjCProtocols = [UIApplicationDelegate];

    applicationDidFinishLaunchingWithOptions(application: UIApplication, launchOptions: NSDictionary<any, any>): boolean {
        return true;
    }

    applicationDidBecomeActive(application: UIApplication): void {
        if (FRESH_LAUNCH) {
            FRESH_LAUNCH = false;
            let splash = new splashPlugin.SplashScreen('ngatlSplash.png', '#b52d31');
            application.keyWindow.addSubview(splash.start());
        }
    }
}
