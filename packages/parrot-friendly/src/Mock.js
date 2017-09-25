export default class Mock {
  constructor(structure) {
    this.structure = structure;
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
    this.structure.response.statusCode = value;
    return this;
  };
}
