// web
export class MockFirebasePlatform {
  public auth = {
    FacebookAuthProvider : () => {
      return 'facebook';
    },
    GoogleAuthProvider : () => {
      return 'google';
    },
  };
}

// {N} nativescript-firebase-plugin
export class MockFirebaseNativeScriptPlatform {
  public analytics: any = {
    logEvent : function (data: { key: string; parameters: any }) {
      return new Promise(
        resolve => {
          console.log(data);
          resolve();
        });
    },
    setUserProperty : function (properties: any) {
      console.log(properties);
    },
  };
}
