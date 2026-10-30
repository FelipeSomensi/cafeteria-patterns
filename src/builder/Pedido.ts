import { Bebida, DadosPedido, ItemPedido, StatusPedido } from "../types";
import { ObservadorPedido } from "../observer/Observador";

/** Product (Builder) e Subject (Observer). */
export class Pedido {
  public readonly cliente: string;
  public readonly observacao: string;
  public readonly entrega: boolean;
  public readonly enderecoEntrega: string;

  private _status: StatusPedido = StatusPedido.CRIADO;
  private readonly _itens: ItemPedido[] = [];
  private observadores: ObservadorPedido[] = [];
  private proximoId = 1;

  constructor(dados: Readonly<DadosPedido>) {
    this.cliente = dados.cliente;
    this.observacao = dados.observacao;
    this.entrega = dados.entrega;
    this.enderecoEntrega = dados.enderecoEntrega;
  }

  get status(): StatusPedido {
    return this._status;
  }

  get itens(): readonly ItemPedido[] {
    return this._itens;
  }

  get total(): number {
    return this._itens.reduce((soma, item) => soma + item.bebida.getPreco(), 0);
  }

  // ---- Receiver (Command): operações de negócio sobre os itens ----
  public adicionarItem(bebida: Bebida): ItemPedido {
    const item: ItemPedido = { id: this.proximoId++, bebida };
    this._itens.push(item);
    return item;
  }

  public removerItem(id: number): void {
    const indice = this._itens.findIndex((item) => item.id === id);
    if (indice === -1) {
      throw new Error(`Item ${id} não encontrado no pedido.`);
    }
    this._itens.splice(indice, 1);
  }

  public restaurarItem(item: ItemPedido): void {
    if (this._itens.some((existente) => existente.id === item.id)) {
      throw new Error(`Item ${item.id} já existe no pedido.`);
    }
    this._itens.push(item);
  }

  // ---- Observer: gerenciamento de inscritos ----
  public inscrever(observador: ObservadorPedido): void {
    this.observadores.push(observador);
  }

  public desinscrever(observador: ObservadorPedido): void {
    this.observadores = this.observadores.filter((o) => o !== observador);
  }

  private notificar(statusAnterior: StatusPedido): void {
    const evento = {
      cliente: this.cliente,
      statusAnterior,
      statusAtual: this._status,
    };
    for (const obs of this.observadores) {
      obs.atualizar(evento);
    }
  }

  // ---- Mudança de estado que dispara a notificação ----
  public mudarStatus(novoStatus: StatusPedido): void {
    if (novoStatus === this._status) return; // sem mudança, sem aviso
    const anterior = this._status;
    this._status = novoStatus;
    this.notificar(anterior);
  }
}
