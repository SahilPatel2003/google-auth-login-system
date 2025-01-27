class Router {
  constructor() {
    this.getRoutes = {};
    this.postRoutes = {};
    this.putRoutes = {};
    this.patchRoutes = {};
    this.deleteRoutes = {};
  }

  _get(url, controller, middlewares = []) {
    this.getRoutes[url] = [...middlewares, controller];
  }

  _post(url, controller, middlewares = []) {
    this.postRoutes[url] = [...middlewares, controller];
  }

  _put(url, controller, middlewares = []) {
    this.putRoutes[url] = [...middlewares, controller];
  }

  _patch(url, controller, middlewares = []) {
    this.patchRoutes[url] = [...middlewares, controller];
  }

  _delete(url, controller, middlewares = []) {
    this.deleteRoutes[url] = [...middlewares, controller];
  }
}

module.exports = Router;
