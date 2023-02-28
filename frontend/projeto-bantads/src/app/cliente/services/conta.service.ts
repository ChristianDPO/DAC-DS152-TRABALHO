import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { LoginService } from '../../auth/services/login.service';
import { SnackBarService } from 'src/app/shared';

import { Cliente } from 'src/app/shared/models/cliente.model';
import { Movimentacao } from 'src/app/shared/models/movimentacao.model';

@Injectable({
  providedIn: 'root'
})
export class ContaService {

  CONTA_URL = 'http://localhost:3000/contas/'
  MOVIMENTACAO_URL = 'http://localhost:3000/movimentacoes/'

  constructor(
    private httpClient: HttpClient, 
    private loginService: LoginService,
    private snackBarService: SnackBarService,
    private router: Router
  ) { }


  //Funcao feita pra passar na (err) => {} do subscribe (ESPECIFICA PARA CONTA)
  handleHttpErrors(err: any){
    switch(err.status){
      //unauthorized - significa que o token expirou ou nao existe, ou seja, o usuario tem que ser deslogado
      case 401:
        this.snackBarService.mostrarSnackBar("Sua sessão expirou, faça login novamente");
        this.loginService.logout();
        this.router.navigate(['/login']);
        break;
      case 404:
        this.snackBarService.mostrarSnackBar("Conta especificada na movimentação não encontrada");
        break;
      case 409:
        //em tese, nao chega aqui
        this.snackBarService.mostrarSnackBar("Movimentação já cadastrada");
        break;
      default:
        break;
    }
  }


  postMovimentacao(movimentacao: Movimentacao): Observable < any >{

    return this.httpClient.post(
      this.MOVIMENTACAO_URL,
      JSON.stringify(movimentacao),
      {
        headers: this.loginService.headersWithToken
      }
    );

  }

  buscarMovimentacaoPorConta(idConta: number): Observable < any >{

    return this.httpClient.get(
      `${this.CONTA_URL}${idConta}/movimentacoes`,
      {
        headers: this.loginService.headersWithToken
      }
    );
  }

}
