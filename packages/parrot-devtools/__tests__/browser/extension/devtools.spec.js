global.chrome = {
  devtools: {
    panels: {
      create: jest.fn(),
    },
  },
};

require('../../../src/browser/extension/devtools');

describe('devtools', () => {
  it('should setup tab', () => {
    expect(global.chrome.devtools.panels.create).toHaveBeenCalledWith(
      'Parrot',
      'assets/img/parrot_48x.png',
      'views/devtool-panel.html'
    );
  });
});
