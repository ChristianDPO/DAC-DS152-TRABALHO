import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { Cliente } from 'src/app/shared/models/cliente.model';
import { Conta } from 'src/app/shared';
import { Movimentacao } from 'src/app/shared/models/movimentacao.model';

import { ClienteService } from '../services/cliente.service';
import { LoginService } from '../../auth/services/login.service';
import { SnackBarService } from 'src/app/shared';
import { ContaService } from '../services/conta.service';

@Component({
  selector: 'app-transferir',
  templateUrl: './transferir.component.html',
  styleUrls: ['./transferir.component.css'],
})
export class TransferirComponent implements OnInit {

  /* Atributos */
  clienteLogado: Cliente = new Cliente();
  contaCliente: Conta = new Conta();
  valorTransf: number = 0.0;
  movimentacao: Movimentacao = new Movimentacao();
  idContaDestino!: string;
  contaFormatada: string = ""

  /* Tabela */

  displayedColumns: string[] = ['atual', 'transf'];
  elementosTabela: object[] = [];

  /* Form Control */
  valor = new FormControl();
  conta = new FormControl();
  value = new FormControl();

  constructor(
    private clienteService: ClienteService,
    private loginService: LoginService,
    private router: Router,
    private snackBarService: SnackBarService,
    private contaService: ContaService
    ) { }

  @ViewChild('formTransferir') formTransferir!: NgForm;

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
              aposTransf: this.contaCliente.saldo
            }];
          },
          error: (err) => { this.loginService.handleHttpErrors(err) }
        });

      }
    });

  }

  atualizaValorAposTransf(): void {//cada vez que o input com o valor da transf for alterado
    if (this.contaCliente.saldo != null) {//se não estiver nulo
      let saldoFinal = this.contaCliente.saldo - this.valorTransf;
      let aux = [{
        atual: this.contaCliente.saldo,//continua com o saldo total
        aposTransf: saldoFinal//atualiza o valor com saldo - valor inserido
      }];
      this.elementosTabela = aux;//reatribui a variavel
      if (this.contaCliente.limite == 0 && saldoFinal < 0) this.formTransferir.controls['valor'].setErrors({ limite: true });
      else
        if (this.contaCliente.limite && saldoFinal < 0 - this.contaCliente.limite) {
          this.formTransferir.controls['valor'].setErrors({ limite: true });
        }
    }
  }

  transferir(): void {
    if (this.formTransferir.form.valid) {
      
      this.movimentacao.idConta = this.contaCliente.id;
      this.movimentacao.idContaOrigem = this.contaCliente.id;
      this.movimentacao.idContaDestino = +this.idContaDestino;
      this.movimentacao.tipo = "tra";
      this.movimentacao.valor = this.valorTransf;

      // console.log(this.movimentacao);

      if(this.movimentacao.idContaOrigem === this.movimentacao.idContaDestino){
        this.snackBarService.mostrarSnackBar('Não é possível realizar uam tranferência para si mesmo', false);
        return;
      }

      this.contaService.postMovimentacao(this.movimentacao).subscribe({
        next: (response: any) => {
          this.snackBarService.mostrarSnackBar('Transferência realizada com sucesso!', true);
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