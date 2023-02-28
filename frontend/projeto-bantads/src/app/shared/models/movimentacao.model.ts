export class Movimentacao {
    constructor(
        public id?: number,
        public idConta?:number,
        public idContaOrigem?: number,
        public idContaDestino?: number,
        public tipo?: string,
        public dataHora?: string,
        public valor?: number,
        public saldoApos?:number
    ) { }
}
