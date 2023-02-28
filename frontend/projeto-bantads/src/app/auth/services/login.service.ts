import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';

import { User } from 'src/app/shared';
import { Login } from 'src/app/shared';

import { SnackBarService } from 'src/app/shared';

const USER_CHAVE: string = "usuarioLogado";
const TOKEN_CHAVE: string = "access_token";


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  BASE_URL = "http://localhost:3000/login/";

  //headers usadas em todas as requisicoes
  defaultHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': 'http://localhost:3000'
  })
  
  constructor(
    private httpClient: HttpClient,
    private router: Router,
    public snackBarService: SnackBarService
  ) { }

  public get usuarioLogado(): User {
    let usu = localStorage[USER_CHAVE];
    return (usu ? JSON.parse(localStorage[USER_CHAVE]) : null);
  }
    
  public set usuarioLogado(user: User) {
    localStorage[USER_CHAVE] = JSON.stringify(user);
  }

  public set accessToken(token: string | null) {
    localStorage[TOKEN_CHAVE] = token;
  }
  
  public get accessToken(): (string | null)  {
    let token:string = localStorage[TOKEN_CHAVE];
    return (token? token : null);
  }

  public get headersWithToken(): (HttpHeaders){

      let token = this.accessToken;
      let headersWithToken: HttpHeaders = this.defaultHeaders;

      //retornar as headers padroes com o token (se existir ou nao)
      return headersWithToken.append(
        'x-access-token',
        token? token : ''
      )
  
  }
  
  //Funcao feita pra passar na (err) => {} do subscribe
  handleHttpErrors(err: any){

    //mostra erro que retorna como uma snackBar (arrumar service da snack bar)
    this.snackBarService.mostrarSnackBar(err.error?.message!, false);

    switch(err.status){
      //unauthorized - significa que o token expirou ou nao existe, ou seja, o usuario tem que ser deslogado
      case 401:
        this.logout();
        this.router.navigate(['/login']);
        break;
      default:
        break;
    }
  }

  logout() {
    delete localStorage[USER_CHAVE];
    delete localStorage[TOKEN_CHAVE];
  }

  login(login: Login): Observable< any > {
    
    return this.httpClient.post(
      this.BASE_URL, 
      JSON.stringify(login),
      {
        headers: this.defaultHeaders
      }
    );

  }
}
