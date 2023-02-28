export class User {

    //Guardar dados comuns entre todos os usuarios
    //perfil: 'CLIENTE' ou 'GERENTE' ou 'ADMIN'

    constructor(
        public email?: string,
        public senha?: string,
        public perfil?: string
    ){}

}
