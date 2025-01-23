export type ResourceConstructorParams<CFG, CN, CL, R> = {
  config?: CFG;
  connections?: CN;
  clients?: CL;
  resources?: R;
}

export class Resource<CFG, CN, CL, R> {
  #config?: CFG;

  #connections?: CN;

  #clients?: CL;

  #resources?: R;

  constructor (params: ResourceConstructorParams<CFG, CN, CL, R>) {
    this.#config = params.config
    this.#connections = params.connections
    this.#clients = params.clients
    this.#resources = params.resources
  }

  get config () {
    return this.#config
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