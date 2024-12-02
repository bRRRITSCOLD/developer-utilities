export class Resource<CN, CL, R> {
  #connections?: CN;

  #clients?: CL;

  #resources?: R;

  constructor (params: { connections?: CN; clients?: CL; resources?: R; }) {
    this.#connections = params.connections
    this.#clients = params.clients
    this.#resources = params.resources
  }

  get connections () {
    return this.#connections
  }

  get clients () {
    return this.#clients
  }

  get resources () {
    return this.#resources
  }
}