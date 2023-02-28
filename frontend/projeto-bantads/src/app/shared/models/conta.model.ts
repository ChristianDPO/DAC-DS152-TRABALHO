export class Conta {
    constructor(
        public id?: number, //serve como numero da conta
        public agencia?: string,
        public dataHoraAbertura?: string, //string com timestamp
        public saldo?: number,
        public limite?: number,
        public idCliente?: number
    ){}
}
