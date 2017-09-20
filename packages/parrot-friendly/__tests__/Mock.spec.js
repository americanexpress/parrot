import Mock from '../src/Mock';

describe('Mock', () => {
  it('creates initial mock structure', () => {
    const mock = new Mock('GET', 'ahoy');
    expect(mock.structure).toEqual({
      request: {
        path: 'ahoy',
        method: 'GET',
      },
      response: {},
    });
  });

  it('adds query', () => {
    const mock = new Mock('GET', 'ahoy');
    mock.query('ahoy');
    expect(mock.structure).toEqual({
      request: {
        path: 'ahoy',
        method: 'GET',
        query: 'ahoy',
      },
      response: {},
    });
  });

  it('adds headers', () => {
    const mock = new Mock('GET', 'ahoy');
    mock.headers('ahoy');
    expect(mock.structure).toEqual({
      request: {
        path: 'ahoy',
        method: 'GET',
        headers: 'ahoy',
      },
      response: {},
    });
  });

  it('adds resource', () => {
    const mock = new Mock('GET', 'ahoy');
    mock.response('ahoy');
    expect(mock.structure).toEqual({
      request: {
        path: 'ahoy',
        method: 'GET',
      },
      response: {
        resource: 'ahoy',
      },
    });
  });

  it('adds delay', () => {
    const mock = new Mock('GET', 'ahoy');
    mock.delay('ahoy');
    expect(mock.structure).toEqual({
      request: {
        path: 'ahoy',
        method: 'GET',
      },
      response: {
        delay: 'ahoy',
      },
    });
  });

  it('adds status', () => {
    const mock = new Mock('GET', 'ahoy');
    mock.status('ahoy');
    expect(mock.structure).toEqual({
      request: {
        path: 'ahoy',
        method: 'GET',
      },
      response: {
        status: 'ahoy',
      },
    });
  });
});
