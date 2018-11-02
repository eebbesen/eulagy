const app = require('../app');

test('runs query', async () => {
  const text = await app.getText();
  expect(text).toContain('the');
});
