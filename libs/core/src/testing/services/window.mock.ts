export class MockWindow {
  public static MEM_CACHE: any = {};

  public localStorage: any = {
    setItem : (
      key,
      value,
    ) => {
      MockWindow.MEM_CACHE[key] = value;
      console.log(key, value);
    },
    getItem :
      key => {
        return MockWindow.MEM_CACHE[key];
      },
    removeItem :
      key => {
        delete MockWindow.MEM_CACHE[key];
      },
    clear : () => {
      MockWindow.resetCache();
    },
  };

  public location: any = {};

  public navigator: any = {
    language : 'en-US',
    userAgent : 'testing',
  };

  // google tag manager stub for web
  public dataLayer: Array<any> = [];

  public static resetCache() {
    MockWindow.MEM_CACHE = {};
  }

  public alert(msg: string): void {
    return;
  }

  public confirm(msg: string): void {
    return;
  }

  public setTimeout(
    handler: (...args: any[]) => void,
    timeout?: number,
  ): number {
    return <any>setTimeout(handler, timeout);
  }

  public clearTimeout(timeoutId: number): void {
    clearTimeout(timeoutId);
  }

  public setInterval(
    handler: (...args: any[]) => void,
    ms?: number,
    ...args: any[]
  ): number {
    return <any>setInterval(handler, ms);
  }

  public clearInterval(intervalId: number): void {
    clearInterval(intervalId);
  }

  public scrollTo(
    x?: number,
    y?: number,
  ) {
    // do nothing
  }

  // analytics
  public ga(
    command: string | Function,
    params?: any,
  ): void {
    console.log(command, params);
  }
}

export class MockWindowFrench extends MockWindow {
  constructor() {
    super();
    this.navigator.language = 'fr-US';
  }
}

export class MockWindowNoLanguage extends MockWindow {
  constructor() {
    super();
    this.navigator.language = undefined;
  }
}
