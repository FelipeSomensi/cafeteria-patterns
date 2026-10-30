import { Comando } from "./Comando";
import { Historico } from "./Historico";

/** Invoker: executa comandos e guarda o histórico para desfazer. */
export class Atendente {
  private readonly historico = new Historico<Comando>();

  public executar(comando: Comando): void {
    comando.execute();
    this.historico.push(comando);
    console.log(`[ATENDENTE] Executado: ${comando.descricao}`);
  }

  public desfazer(): void {
    const ultimo = this.historico.pop();
    if (!ultimo) {
      console.log("[ATENDENTE] Nada para desfazer.");
      return;
    }
    ultimo.undo();
    console.log(`[ATENDENTE] Desfeito: ${ultimo.descricao}`);
  }
}