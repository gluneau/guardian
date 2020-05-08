import joi from '@hapi/joi';
import { Observable, from } from 'rxjs';
import { switchMap, map, flatMap } from 'rxjs/operators';
import { get, isArray, isNil } from 'lodash';
import { ApiRx } from '@polkadot/api';
import Task from '../Task';

const createCall = (api: ApiRx, name: string, args: any[] = []): Observable<Output> => {
  const method = get(api.query, name);
  if (isNil(method)) throw Error(`cannot find storage ${name}`);

  return method.call(null, ...args).pipe(map((value) => ({ name, value })));
};

type Output = { name: string; value: any };

export default class StorageTask extends Task {
  api$: Observable<ApiRx>;

  validationSchema = joi.object({
    name: joi.alt(
      joi.when('args', {
        then: joi.string(),
        otherwise: joi.alt(joi.string(), joi.array().items(joi.string())),
      })
    ),
    args: joi.any(),
  });

  constructor(api$: Observable<ApiRx>) {
    super();
    this.api$ = api$;
  }

  call(params: { name: string | string[]; args?: any | any[] }): Observable<Output> {
    const { name, args } = this.validateParameters(params);

    return this.api$.pipe(
      switchMap((api) => {
        if (isArray(name)) {
          return from(name).pipe(flatMap((name) => createCall(api, name)));
        }
        return createCall(api, name, isArray(args) ? args : [args]);
      })
    );
  }
}