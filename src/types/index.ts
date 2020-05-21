import { Observable, Subscription } from 'rxjs';
import Joi from '@hapi/joi';

export type NetworkType = 'laminarChain' | 'acalaChain' | 'substrateChain' | 'ethereum';

export interface GuardianInterface {
  validationSchema: Joi.Schema;
  validateConfig<T>(config: T): T;
  monitors: MonitorInterface[];
  start(): void;
  stop(): void;
}

export interface MonitorInterface {
  name: string;
  config: MonitorConfig;
  task: TaskInterface<any>;
  rawOutput$: Observable<any>;
  output$: Observable<any>;
  post(action: ActionPOST, result: any): void;
  script(action: ActionScript, result: any): void;
  listen(): Subscription;
}

export interface TaskInterface<Output> {
  run(params: any): Observable<any>;
  validateCallArguments<T>(args?: T): T;

  validationSchema: Joi.Schema;
  init(params: any): Observable<Output>;
}

export interface LaminarGuardianConfig {
  networkType: 'laminarChain';
  nodeEndpoint: string | string[];
  network: 'dev' | 'turbulence' | 'reynolds' | 'mainnet';
  confirmation: 'finalize' | number;
  monitors: {
    [key: string]: MonitorConfig;
  };
}

export interface AcalaGuardianConfig {
  networkType: 'acalaChain';
  nodeEndpoint: string | string[];
  network: 'dev' | 'karura' | 'mainnet';
  confirmation: 'finalize' | number;
  monitors: {
    [key: string]: MonitorConfig;
  };
}

export interface SubstrateGuardianConfig {
  networkType: 'substrateChain';
  nodeEndpoint: string | string[];
  confirmation: 'finalize' | number;
  monitors: {
    [key: string]: MonitorConfig;
  };
}

export interface EthereumGuardianConfig {
  networkType: 'ethereum';
  nodeEndpoint: string;
  network: 'dev' | 'kovan' | 'mainnet';
  monitors: {
    [key: string]: MonitorConfig;
  };
}

export type ActionScript = {
  method: 'script';
  path: string;
};

export type ActionPOST = {
  method: 'POST';
  url: string;
  headers?: any;
};

export interface MonitorConfig {
  task: string;
  arguments?: any;
  conditions?: any[];
  actions: (ActionScript | ActionPOST)[];
}

export interface Config {
  version: string;
  guardians: {
    [name: string]: LaminarGuardianConfig | AcalaGuardianConfig | SubstrateGuardianConfig | EthereumGuardianConfig;
  };
}