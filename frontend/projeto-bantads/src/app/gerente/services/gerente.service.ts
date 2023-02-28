import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { LoginService } from '../../auth/services/login.service';

import { Cliente } from 'src/app/shared/models/cliente.model';

@Injectable({
  providedIn: 'root'
})
export class GerenteService {
  
  GERENTE_URL: string = "http://localhost:3000/gerentes/";

  constructor(
    private httpClient: HttpClient, 
    private loginService: LoginService
  ){ }

  // Método que lista todos os gerentes
  listarGerentes(): Observable<any> {

    return this.httpClient.get(
      this.GERENTE_URL, 
      {
        headers: this.loginService.headersWithToken
      }
    );

  }

  // Método que busca o gerente atualmente logado
  getGerenteLogado(): Observable <any> {

    let usu = this.loginService.usuarioLogado;

    return this.httpClient.get(
      this.GERENTE_URL, 
      {
        headers: this.loginService.headersWithToken,
        params: { email: usu.email! }
      }
    );

  }

  // Método que lista todos os pedidos de autocadastro do gerente, os quais estão pendentes de aprovação
  listarPedidosAutocadastro(id_gerente: number): Observable <Cliente[]> {

    return this.httpClient.get<Cliente[]>(
      `${this.GERENTE_URL}${id_gerente}/clientes`,
      {
        headers: this.loginService.headersWithToken,
        params: { aprovado: false }
      }
    );
  
  }

  // Método que lista todos os clientes do gerente
  listarClientes(id_gerente: number): Observable <Cliente[]> {

    return this.httpClient.get<Cliente[]>(
      `${this.GERENTE_URL}${id_gerente}/clientes`,
      {
        headers: this.loginService.headersWithToken,
        params: { aprovado: true }
      }
    );

  }

  // Método que lista os 5 melhores clientes do gerente
  listarMelhoresClientes(id_gerente: number): Observable <Cliente[]> {

    return this.httpClient.get<Cliente[]>(
      `${this.GERENTE_URL}${id_gerente}/clientes`,
      {
        headers: this.loginService.headersWithToken,
        params: { aprovado: true }
      }
    );
    
  }

}
