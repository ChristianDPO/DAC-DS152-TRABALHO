import { Component, OnInit, ViewChild } from '@angular/core';

import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { MatSnackBar } from '@angular/material/snack-bar';

import { Gerente, User } from 'src/app/shared';

import { AdminService } from '../services/admin.service';
import { SnackBarService } from 'src/app/shared';

@Component({
  selector: 'app-inserir-gerente',
  templateUrl: './inserir-gerente.component.html',
  styleUrls: ['./inserir-gerente.component.css']
})
export class InserirGerenteComponent implements OnInit {
  
  /* Atributos */
  gerente: Gerente = new Gerente();
  confirmPassword!:string

  /* Form */
  @ViewChild('formGerente') formGerente!: NgForm;

  constructor(
    private adminService: AdminService,  
    private router: Router, 
    private snackBarService: SnackBarService
  ) { }

  ngOnInit(): void {
    this.confirmPassword = '';
  }

  validarCpf(cpf: string) {
    if(!cpf){
      return;
    }
    //Opcoes invalidas
    if (cpf.length != 11 || cpf == "00000000000" || cpf == "11111111111" || cpf == "22222222222" || cpf == "33333333333" ||
      cpf == "44444444444" || cpf == "55555555555" || cpf == "66666666666" || cpf == "77777777777" ||
      cpf == "88888888888" || cpf == "99999999999")
      this.formGerente.controls['cpf'].setErrors({ cpfInvalido: true });

    let dig = 0;
    let ver = 0;

    for (let i = 0; i < 9; i++)//para os 9 primeiros digitos
      dig += parseInt(cpf.charAt(i)) * (10 - i);//multiplica por seu peso e adiciona

    ver = 11 - (dig % 11);//recebe o 1° digito verificador

    if (ver == 10 || ver == 11)//caso for maior que 10 o dig fica 0 
      ver = 0;

    if (ver != parseInt(cpf.charAt(9)))//confere se o 1° digito verificador está correto
      this.formGerente.controls['cpf'].setErrors({ cpfInvalido: true });


    dig = 0;//passos para verificar o 2° digito verificador
    for (let i = 0; i < 10; i++)//para os 9 primeiros digitos + 1° digito verificador
      dig += parseInt(cpf.charAt(i)) * (11 - i);

    ver = 11 - (dig % 11); //recebe o 2° digito verificador

    if (ver == 10 || ver == 11)//caso for maior que 10 o dig fica 0 
      ver = 0;

    if (ver != parseInt(cpf.charAt(10)))//confere se o 2° digito verificador tbm está correto
      this.formGerente.controls['cpf'].setErrors({ cpfInvalido: true });

    return;
  }

  cadastrar(){
    if(this.formGerente.valid){

      this.adminService.inserirGerente(this.gerente).subscribe({
        next: (response: any) => {
          this.snackBarService.mostrarSnackBar('Gerente cadastrado com sucesso', true)
          this.router.navigate(['/home-admin'])
        },
        error: (err: any) => {this.adminService.handleHttpErrors(err)}
      })
    }
  }

}
