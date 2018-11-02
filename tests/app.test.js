const app = require('../app');

test('runs query', async () => {
  const text = await app.getText();
  expect(text).toContain('Our Statement of Rights and Responsibilities is changing to our Terms of Service');
});