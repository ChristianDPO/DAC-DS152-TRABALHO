import { EnderecoCliente } from "./endereco-cliente.model";

export class Cliente {
    constructor(
        public id?: number,
        public nome?: string,
        public email?: string,
        public cpf?: string,
        public endereco?: EnderecoCliente,
        public salario?: number,
        public aprovado?: boolean,
        public idGerente?: number,
        public mensagemReprovacao?: string
    ) { }
}
