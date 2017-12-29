import {
  RequestOptions,
  ResponseOptions,
  ResponseOptionsArgs,
  Response,
  Http,
  ConnectionBackend,
  BaseRequestOptions,
} from '@angular/http';
import {
  MockBackend,
  MockConnection,
} from '@angular/http/testing';

import { tLog } from '../utils';
import {
  LocaleService,
  StorageService,
  NetworkCommonService,
  HttpErrorService,
} from '../../modules/core/services';
import { httpFactory } from '../../modules/core/core.module';
import {
  getMockUser,
  getMockUserWithCustom,
  getTestToken,
} from '../models/user.mock';

export const TEST_BASE_API = 'https://api-rc.ngatl.com/';
export const TEST_BASE_API_VERSION = 'api/4.0/';
export const TEST_API_URL = `${TEST_BASE_API}${TEST_BASE_API_VERSION}`;

export const setupBackendMocks = function (backend: MockBackend) {
  backend.connections.subscribe((connection: MockConnection) => {
    const url = connection.request.url;
    tLog('--- api request ---');
    tLog(url);
    const api = url.split('/').slice(-1)[0]; // end of api url
    tLog('endpoint:', api);
    let body = connection.request.getBody();
    if ( body ) {
      body = JSON.parse(body);
    }
    tLog('body:', body);
    let resp: ResponseOptionsArgs;
    if ( url.includes('users/2') ) {
        // user request
        resp = {
          status : 200,
          body : Object.assign(getMockUser(), { id : 2 }),
        };
    } else {

    }
    if ( resp && resp.body ) {
      resp.body = JSON.stringify(resp.body);
    }
    tLog('mock response:', resp.body);
    connection.mockRespond(new Response(new ResponseOptions(resp)));
  });
};

export const MOCK_BACKEND_PROVIDERS: any[] = [
  MockBackend,
  BaseRequestOptions,
  {
    provide : Http,
    useFactory : httpFactory,
    deps : [
      MockBackend,
      BaseRequestOptions,
      LocaleService,
      HttpErrorService,
      NetworkCommonService,
    ],
  },
];
