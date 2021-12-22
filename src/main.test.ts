import { handler } from './main';

describe('test', () => {
  test('main test', async () => {
    await handler();
  }, 600000);
});
