import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms'
import { Router, ActivatedRoute } from '@angular/router';

import { User } from 'src/app/shared';
import { Login } from 'src/app/shared';

import { LoginService } from '../services/login.service';
import { SnackBarService } from 'src/app/shared';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @ViewChild('formUser') formUser!: NgForm;

  /* Atributos */
  login!: Login;

  constructor(
    private loginService: LoginService,
    private router: Router,
    private route: ActivatedRoute,
    public snackBarService: SnackBarService
  ) {

    const usuarioLogado = this.loginService.usuarioLogado;

    this.route.queryParams.subscribe(params => {

      if (params['error'] != undefined)
        this.snackBarService.mostrarSnackBar(params['error'], false);

    });

    if (usuarioLogado) {
      if (usuarioLogado.perfil == 'ADM') {
        this.router.navigate(["/home-admin"]);
      }
      else if (usuarioLogado.perfil == 'GER') {
        this.router.navigate(["/home-gerente"]);
      }
      else if (usuarioLogado.perfil == 'CLI') {
        this.router.navigate(["/home-cliente"]);
      }
    }

  }

  ngOnInit(): void {
    this.login = new Login();
  }

  logar(): void {

    if (this.formUser.valid) {

      let usu = new User();

      this.loginService.login(this.login).subscribe({
        next: (response: any) => {

          usu = new User(
            response.data.login,
            '',
            response.data.perfil
          );

          this.loginService.usuarioLogado = usu;
          this.loginService.accessToken = response.token;

          this.snackBarService.mostrarSnackBar("Seja muito bem-vindo(a) ao BANTADS!", true)

          if (usu.perfil == 'ADM') {
            this.router.navigate(["/home-admin"]);
          }
          else if (usu.perfil == 'GER') {
            this.router.navigate(["/home-gerente"]);
          }
          else if (usu.perfil == 'CLI') {
            this.router.navigate(["/home-cliente"]);
          }

        },
        error: (err: any) => {
          this.loginService.handleHttpErrors(err)
        }
      });
    }

    else {
      this.snackBarService.mostrarSnackBar("Digite um usuário e senha válidos", false)
    }

  }

}