// similar api to @ng-bootstrap
export class MockModalWeb {
  public static forceReject: boolean;
  public componentInstance: any;
  public result: Promise<any>;
  public resultResolve: Function;
  public resultReject: Function;

  constructor() {
    this.result = new Promise((
      resolve,
      reject,
    ) => {
      this.resultResolve = resolve;
      this.resultReject = reject;
    });
  }

  public open(
    cmpType: any,
    options?: any,
  ): any {
    this.componentInstance = new cmpType();
    return this;
  }

  public close(result?: any) {
    console.log(result);
    if ( MockModalWeb.forceReject ) {
      this.resultReject(result);
    } else {
      this.resultResolve(result);
    }
  }
}

// similar api to {N} ModalDialogService
export class MockModalNativeScript extends MockModalWeb {
  public open(
    cmpType: any,
    options?: any,
  ) {
    // {N} ModalDialogService (showModal) returns a promise
    return new Promise((
      resolve,
      reject,
    ) => {
      this.resultResolve = resolve;
      this.resultReject = reject;
    });
  }
}
