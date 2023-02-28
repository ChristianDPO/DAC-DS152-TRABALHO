import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { Conta, Gerente } from 'src/app/shared';

import { LoginService } from '../../auth/services/login.service';
import { SnackBarService } from 'src/app/shared';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  GERENTE_URL = "http://localhost:3000/gerentes/"
  CONTA_URL: string = "http://localhost:3000/contas/";

  constructor(
    private httpClient: HttpClient, 
    private loginService: LoginService,
    private snackBarService: SnackBarService,
    private router: Router
  ) { }

  //Funcao feita pra passar na (err) => {} do subscribe (ESPECIFICA PARA GERENTE)
  handleHttpErrors(err: any){
    switch(err.status){
      //unauthorized - significa que o token expirou ou nao existe, ou seja, o usuario tem que ser deslogado
      case 401:
        this.snackBarService.mostrarSnackBar("Sua sessão expirou, faça login novamente");
        this.loginService.logout();
        this.router.navigate(['/login']);
        break;
      case 404:
        this.snackBarService.mostrarSnackBar("Gerente especificado não encontrado");
        this.router.navigate(['/gerentes/listar']);
        break;
      case 409:
        this.snackBarService.mostrarSnackBar("Email ou CPF já cadastrados no sistema");
        break;
      default:
        break;
    }
  }

  listarContas(): Observable <Conta[]> {

    return this.httpClient.get<Conta[]>(
      this.CONTA_URL,
      {
        headers: this.loginService.headersWithToken
      }
    );

  }

  inserirGerente(gerente: Gerente): Observable < any >{

    return this.httpClient.post(
      this.GERENTE_URL,
      JSON.stringify(gerente),
      {
        headers: this.loginService.headersWithToken
      }
    );

  }

  atualizarGerente(gerente: Gerente): Observable < any >{
    
    return this.httpClient.put(
      `${this.GERENTE_URL}${gerente.id}`,
      JSON.stringify(gerente),
      {
        headers: this.loginService.headersWithToken
      }
    );

  }

  removerGerente(gerente: Gerente): Observable < any >{
    
    return this.httpClient.delete(
      `${this.GERENTE_URL}${gerente.id}`,
      {
        headers: this.loginService.headersWithToken,
        body: JSON.stringify(gerente)
      }
    );

  }

  buscarGerente(id: number):  Observable < any > {

    return this.httpClient.get(
      `${this.GERENTE_URL}${id}`,
      {
        headers: this.loginService.headersWithToken
      }
    );

  }

}
