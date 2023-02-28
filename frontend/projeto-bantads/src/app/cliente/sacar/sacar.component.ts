import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { Cliente } from 'src/app/shared/models/cliente.model';
import { Conta } from 'src/app/shared';
import { Movimentacao } from 'src/app/shared/models/movimentacao.model';

import { ContaService } from '../services/conta.service';
import { LoginService } from 'src/app/auth/services/login.service';
import { ClienteService } from '../services/cliente.service';
import { SnackBarService } from 'src/app/shared';

@Component({
  selector: 'app-sacar',
  templateUrl: './sacar.component.html',
  styleUrls: ['./sacar.component.css']
})
export class SacarComponent implements OnInit {

  /* Atributos */
  clienteLogado: Cliente = new Cliente();
  movimentacao: Movimentacao = new Movimentacao();
  contaCliente: Conta = new Conta();
  valorSaque: number = 0.0;
  contaFormatada:string = "";

  /* Tabela */
  displayedColumns: string[] = ['atual', 'saque'];
  elementosTabela: object[] = [{
    atual: 0.0,
    aposSaque: 0.0
  }];

  constructor(
    private clienteService: ClienteService,
    private loginService: LoginService,
    private router: Router,
    private snackBarService: SnackBarService,
    private contaService: ContaService
  ) { }

  @ViewChild('formSacar') formSacar!: NgForm;

  ngOnInit(): void {

    //Armazena dados do cliente logado
    this.clienteService.getClienteLogado().subscribe({
      next: (response: any) => {
        this.clienteLogado = response;
      },
      error: (err) => { this.loginService.handleHttpErrors(err) },
      complete: () => {

        //Armazena conta do cliente logado
        this.clienteService.getContaFromCliente(this.clienteLogado.id!).subscribe({
          next: (response: any) => {
            this.contaCliente = response;
            this.contaFormatada = this.clienteService.formatarNumConta(this.contaCliente.id!);
            this.elementosTabela = [{
              atual: this.contaCliente.saldo,
              aposSaque: this.contaCliente.saldo
            }];
          },
          error: (err) => { this.loginService.handleHttpErrors(err) }
        });

      }
    });

  }

  atualizaValorAposSaque(): void {//cada vez que o input com o valor do saque for alterado
    if (this.contaCliente.saldo != null) {//se não estiver nulo
      let saldoFinal = this.contaCliente.saldo - this.valorSaque;
      let aux = [{
        atual: this.contaCliente.saldo,//continua com o saldo total
        aposSaque: saldoFinal//atualiza o valor com saldo - valor inserido
      }];
      this.elementosTabela = aux;//reatribui a variavel
      if (this.contaCliente.limite == 0 && saldoFinal < 0) this.formSacar.controls['valor'].setErrors({ limite: true });
      else
        if (this.contaCliente.limite && saldoFinal < 0 - this.contaCliente.limite) {
          this.formSacar.controls['valor'].setErrors({ limite: true });
        }
    }
  }

  sacar(): void {
    if (this.formSacar.form.valid) {


      this.movimentacao.idConta = this.contaCliente.id;
      this.movimentacao.idContaOrigem = this.contaCliente.id;
      this.movimentacao.idContaDestino = this.contaCliente.id;
      this.movimentacao.tipo = "saq";
      this.movimentacao.valor = this.valorSaque;

      // console.log(this.movimentacao);

      this.contaService.postMovimentacao(this.movimentacao).subscribe({
        next: (response: any) => {
          this.snackBarService.mostrarSnackBar('Saque disponibilizado com sucesso!', true);
          this.router.navigate(["/home-cliente"]);
        },
        error: (err: any) => {this.contaService.handleHttpErrors(err)}
      });
    }
  }

  logout(): void {
    this.loginService.logout();
    this.snackBarService.mostrarSnackBar("Sua sessão foi encerrada. Até Logo!", true);
    this.router.navigate(['/login']);
  }

}
