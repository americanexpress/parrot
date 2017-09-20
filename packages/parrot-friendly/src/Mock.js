export default class Mock {
  constructor(method, path) {
    this.structure = {
      request: { path, method },
      response: {},
    };
  }

  query = value => {
    this.structure.request.query = value;
    return this;
  };

  headers = value => {
    this.structure.request.headers = value;
    return this;
  };

  response = value => {
    this.structure.response.resource = value;
    return this;
  };

  delay = value => {
    this.structure.response.delay = value;
    return this;
  };

  status = value => {
    this.structure.response.status = value;
    return this;
  };
}
