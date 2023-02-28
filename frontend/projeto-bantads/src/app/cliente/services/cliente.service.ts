import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { LoginService } from '../../auth/services/login.service';
import { SnackBarService } from 'src/app/shared';

import { Cliente } from 'src/app/shared/models/cliente.model';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  CLIENTE_URL: string = "http://localhost:3000/clientes/";

  constructor(
    private httpClient: HttpClient, 
    private loginService: LoginService,
    private snackBarService: SnackBarService,
    private router: Router
  ) { }

  //Funcao feita pra passar na (err) => {} do subscribe (ESPECIFICA PARA CLIENTE)
  handleHttpErrors(err: any){
    switch(err.status){
      //unauthorized - significa que o token expirou ou nao existe, ou seja, o usuario tem que ser deslogado
      case 401:
        this.snackBarService.mostrarSnackBar("Sua sessão expirou, faça login novamente");
        this.loginService.logout();
        this.router.navigate(['/login']);
        break;
      case 404:
        this.snackBarService.mostrarSnackBar("Cliente especificado não encontrado");
        this.loginService.logout();
        this.router.navigate(['/login']);
        break;
      case 409:
        this.snackBarService.mostrarSnackBar("Email ou CPF já cadastrados no sistema");
        break;
      default:
        break;
    }
  }

  formatarNumConta(conta: number): string {
    let aux: string = conta.toString();
    let tamanho = 5 - aux.length;
    for (let i = 0; i < tamanho; i++) aux = "0" + aux;
    return aux;
  }

  // Método que lista todos os clientes
  listarClientes(): Observable<any> {

    return this.httpClient.get(
      this.CLIENTE_URL, 
      {
        headers: this.loginService.headersWithToken,
        params: { aprovado: true }
      }
    );

  }

  // Método que busca o cliente atualmente logado
  getClienteLogado(): Observable<any> {

    let usu = this.loginService.usuarioLogado;

    return this.httpClient.get(
      this.CLIENTE_URL, 
      {
        headers: this.loginService.headersWithToken,
        params: { email: usu.email! }
      }
    );

  }

  // Método que busca o cliente pelo cpf
  getClienteByCpf(cpf: string) : Observable<any> {
    
    return this.httpClient.get(
      this.CLIENTE_URL, 
      {
        headers: this.loginService.headersWithToken,
        params: { cpf: cpf }
      }
    );

  }

  // Método para buscar a conta do cliente atualmente logado
  getContaFromCliente(id_cliente: number): Observable<any> {

    return this.httpClient.get(
      `${this.CLIENTE_URL}${id_cliente}/contas`, 
      {
        headers: this.loginService.headersWithToken
      }
    );

  }

  // Método que insere um cliente
  cadastrar(cliente: Cliente): Observable < any > {
    
    return this.httpClient.post(
      this.CLIENTE_URL,
      JSON.stringify(cliente),
      {
        headers: this.loginService.defaultHeaders
      }
    );

  }

  // Método que altera um cliente
  putCliente(cliente: Cliente): Observable<any> {
    
    return this.httpClient.put(
      `${this.CLIENTE_URL}${cliente.id}`, 
      JSON.stringify(cliente),
      {
        headers: this.loginService.headersWithToken
      }
    );

  }

}
