export interface ICategories {
  USERS: string;
  DIALOGS: string;
  APP_VERSION: string;
  BUTTONS: string;
  ERRORS: string;
}

export interface IActions {
  SET_USER_PROPERTIES_USER: string;
  ERROR_LOW_MEMORY: string;
  ERROR_UNCAUGHT_EXCEPTION: string;
}

export class Tracking {
  public static Categories: ICategories = {
    USERS : 'Users',
    DIALOGS : 'Dialogs',
    APP_VERSION : 'App Version',
    BUTTONS : 'Buttons',
    ERRORS: 'Errors',
  };

  public static Actions: IActions = {
    // LOGGED_IN: 'Logged in',
    // LOGGED_IN_FROM_PAGE: 'Logged in from page',
    // LOGGED_OUT: 'Logged out',
    // LOGGED_IN_USING_PROVIDER: 'Logged in with provider',
    // LOGGED_IN_USING_PROVIDER_FROM_PAGE: 'Logged in with provider from page',
    // ACCOUNT_CONNECTED_NETWORK_PROVIDER: 'Account connected to a provider',
    // ACCOUNT_CREATED_FROM_PAGE: 'Account created from page',
    // ACCOUNT_CREATED_USING_PROVIDER: 'Account created using a provider',
    // ACCOUNT_RESET_PASSWORD: 'Account reset password',
    // ERROR_401: 'Error Code: 401',
    // ERROR_500: 'Error Code: 500',
    // ERROR_404: 'Page Not Found',

    // error_404 page not found
    // error 500 server error
    // error 401 permission denied
    // payemtents updated card payment, user update credit card
    // payment updates card error, user tried to update credit card but got error
    // app version web
    // app version app
    // login user set user properties method
    // use set user properties to initisalise the following session level properties, zone id app version

    ERROR_LOW_MEMORY: 'error_low_memory',
    ERROR_UNCAUGHT_EXCEPTION: 'error_uncaught_exception',
    // ERROR: 'General Error',
    // PAYMENTS_ERROR: 'Payments: Error occurred',
    // PAYMENTS_UPDATED_CARD: 'Payments: User updated credit card',
    // PAYMENTS_UPDATED_CARD_ERROR: 'Payments: User tried to update credit card but got error',
    // APP_VERSION_WEB: 'Web app version:',
    // APP_VERSION_NATIVE: 'Native app version:',
    SET_USER_PROPERTIES_USER : 'set_user_properties_user',
  };
}
