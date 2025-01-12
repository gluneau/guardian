import LaminarGuardian from '../LaminarGuardian';
import { LaminarGuardianConfig } from '../../types';

const config: LaminarGuardianConfig = {
  chain: 'laminar',
  network: 'dev',
  nodeEndpoint: 'ws://localhost:9944',
  monitors: []
};

describe('LaminarGuardian', () => {
  const guardian = new LaminarGuardian(config);

  it('should work', () => {
    const { error, value } = guardian.validationSchema().validate({ ...config }, { allowUnknown: true });
    expect(error).toBeUndefined();
    expect(value).toStrictEqual(config);
  });

  it('should replace default values', () => {
    const { error, value } = guardian
      .validationSchema()
      .validate({ ...config, nodeEndpoint: undefined }, { allowUnknown: true });
    expect(error).toBeUndefined();
    expect(value).toStrictEqual(config);
  });
});
