import Mock from '../src/Mock';

describe('Mock', () => {
  it('creates initial mock structure', () => {
    const mock = new Mock('ahoy');
    expect(mock.structure).toEqual('ahoy');
  });

  it('adds query', () => {
    const mock = new Mock({ request: {} });
    mock.query('ahoy');
    expect(mock.structure).toEqual({
      request: {
        query: 'ahoy',
      },
    });
  });

  it('adds headers', () => {
    const mock = new Mock({ request: {} });
    mock.headers('ahoy');
    expect(mock.structure).toEqual({
      request: {
        headers: 'ahoy',
      },
    });
  });

  it('adds resource', () => {
    const mock = new Mock({ response: {} });
    mock.response('ahoy');
    expect(mock.structure).toEqual({
      response: {
        resource: 'ahoy',
      },
    });
  });

  it('adds delay', () => {
    const mock = new Mock({ response: {} });
    mock.delay('ahoy');
    expect(mock.structure).toEqual({
      response: {
        delay: 'ahoy',
      },
    });
  });

  it('adds status', () => {
    const mock = new Mock({ response: {} });
    mock.status('ahoy');
    expect(mock.structure).toEqual({
      response: {
        statusCode: 'ahoy',
      },
    });
  });
});
