import { Tracking } from './tracking';

describe('Helpers > Tracking for Analytics', () => {
  it('Categories', () => {
    expect(Object.keys(Tracking.Categories).length).toBe(7);
  });

  it('Actions', () => {
    expect(Object.keys(Tracking.Actions).length).toBe(22);
  });
});
