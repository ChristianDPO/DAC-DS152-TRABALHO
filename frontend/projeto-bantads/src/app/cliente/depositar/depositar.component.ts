import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { ClienteService } from '../services/cliente.service';
import { ContaService } from '../services/conta.service';
import { LoginService } from 'src/app/auth/services/login.service';
import { SnackBarService } from 'src/app/shared';

import { Cliente } from 'src/app/shared/models/cliente.model';
import { Movimentacao } from 'src/app/shared/models/movimentacao.model';
import { Conta } from 'src/app/shared';

@Component({
  selector: 'app-depositar',
  templateUrl: './depositar.component.html',
  styleUrls: ['./depositar.component.css']
})
export class DepositarComponent implements OnInit {
  
  /* Atributos */
  clienteLogado: Cliente = new Cliente();
  contaCliente: Conta = new Conta();  
  movimentacao: Movimentacao = new Movimentacao();
  valorDeposito:number = 0.0;
  contaFormatada: string = "";

  /* Tabela */
  displayedColumns: string[] = ['conta', 'agencia'];
  elementosTabela = [{
    conta: 0,
    agencia: '12345'
  }];

  /* Form Control */
  @ViewChild('formDepositar') formDepositar!: NgForm;

  constructor(
    private clienteService: ClienteService, 
    private loginService: LoginService,
    private contaService: ContaService,
    private router: Router, 
    private snackBarService: SnackBarService) 
  { }
  
  ngOnInit(): void {

    //Armazena dados do cliente logado
    this.clienteService.getClienteLogado().subscribe({
      next: (response: any) => {
        this.clienteLogado = response;
      },
      error: (err) => {this.loginService.handleHttpErrors(err)},
      complete: () => {
        
        //Armazena conta do cliente logado
        this.clienteService.getContaFromCliente(this.clienteLogado.id!).subscribe({
          next: (response: any) => {
            this.contaCliente = response;
            this.contaFormatada = this.clienteService.formatarNumConta(this.contaCliente.id!);
            this.elementosTabela[0]['conta'] = this.contaCliente.id!;
          },
          error: (err) => {this.loginService.handleHttpErrors(err)}
        });
      }
    });

  }

  depositar(): void {
    if (this.formDepositar.form.valid) {
      
      this.movimentacao.idConta = this.contaCliente.id;
      this.movimentacao.idContaOrigem = this.contaCliente.id;
      this.movimentacao.idContaDestino = this.contaCliente.id;
      this.movimentacao.tipo = "dep";
      this.movimentacao.valor = this.valorDeposito;

      // console.log(this.movimentacao);

      this.contaService.postMovimentacao(this.movimentacao).subscribe({
        next: (response: any) => {
          this.snackBarService.mostrarSnackBar('Valor depositado com sucesso', true);
          this.router.navigate(["/home-cliente"]);
        },
        error: (err: any) => {this.contaService.handleHttpErrors(err)}
      });

    }
  }

  logout(): void{
    this.loginService.logout();
    this.snackBarService.mostrarSnackBar("Sua sessão foi encerrada. Até Logo!", true);
    this.router.navigate(['/login']);
  }


}
