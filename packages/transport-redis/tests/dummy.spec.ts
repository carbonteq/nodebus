import { add } from '@carbonteq/nodebus-transport-redis';

describe('1 + 1', () => {
  it('should equal 2', () => {
    expect(add(1, 1)).toBe(2);
  });
});
