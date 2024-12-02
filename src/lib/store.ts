import { createContext } from "react";

export class Store<S, Q, M> {
  public state: S;
  public queries: Q;
  public mutations: M;

  public constructor(store: { state: S; queries: Q; mutations: M}) {
    this.state = store.state || {} as S
    this.queries = store.queries || {} as Q
    this.mutations = store.mutations || {} as M
  }
}


export const StoresContext = createContext(null);