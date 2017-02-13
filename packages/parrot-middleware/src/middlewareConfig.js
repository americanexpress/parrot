class MiddlewareConfig {
  set config(val) {
    if (!this._config) {
      this._config = val;
    } else {
      throw Error('Initial config value shouldn\'t be mutated!');
    }
  }

  get config() {
    return this._config;
  }
}

export default new MiddlewareConfig();
