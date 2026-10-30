/** Pilha genérica (LIFO): serve para qualquer tipo T. */
export class Historico<T> {
  private readonly itens: T[] = [];

  push(item: T): void {
    this.itens.push(item);
  }

  pop(): T | undefined {
    return this.itens.pop();
  }

  get tamanho(): number {
    return this.itens.length;
  }
}