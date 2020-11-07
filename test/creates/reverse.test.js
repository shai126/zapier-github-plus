const zapier = require('zapier-platform-core');

// Use this to make test calls into your app:
const App = require('../../index');
const appTester = zapier.createAppTester(App);
zapier.tools.env.inject();

describe('My App', () => {
  it('should reverse the string', async () => {
    const bundle = { inputData: { str: 'Hello!' } };

    const result = await appTester(App.creates.reverse.operation.perform, bundle);
    expect(result).toEqual({
      reversedString: '!olleH',
    });
  });
});
