/** Command: contrato de toda ação que pode ser executada e desfeita. */
export interface Comando {
  readonly descricao: string;
  execute(): void;
  undo(): void;
}