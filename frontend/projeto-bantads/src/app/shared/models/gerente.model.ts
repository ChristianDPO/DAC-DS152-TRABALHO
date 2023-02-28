export class Gerente {
    constructor(
        public id?: number,
        public nome?:string,
        public cpf?: string,
        public email?: string,
        public senha?: string,
        public numClientes: number = 0,
        public totalSaldosPositivos: number = 0,
        public totalSaldosNegativos: number = 0
    ){}
}
