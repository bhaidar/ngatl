import { Injectable } from '@angular/core';

// app
import { LoopBackConfig, LoggerService } from '@ngatl/api';

const apiBaseUrl = 'http://127.0.0.1:3000';
const apiVersion = 'api/v1';

@Injectable()
export class ApiService {
  constructor(private _logger: LoggerService) {
    // config loopback
    LoopBackConfig.setDebugMode(true);
    LoopBackConfig.setBaseURL(apiBaseUrl);
    LoopBackConfig.setApiVersion(apiVersion);
    this._logger.info(`Configure LoopBack: ${apiBaseUrl}/${apiVersion}`);
  }
}
