import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';

import { Cliente } from 'src/app/shared/models/cliente.model';
import { EnderecoCliente } from 'src/app/shared/models/endereco-cliente.model';
import { Conta } from 'src/app/shared';

import { LoginService } from 'src/app/auth/services/login.service';
import { ClienteService } from '../services/cliente.service';
import { SnackBarService } from 'src/app/shared';

@Component({
  selector: 'app-listar-operacoes',
  templateUrl: './listar-operacoes.component.html',
  styleUrls: ['./listar-operacoes.component.css']
})
export class ListarOperacoesComponent implements OnInit {
  
  /* Atributos */
  clienteLogado: Cliente = new Cliente();
  contaCliente: Conta = new Conta();
  loading: boolean = false;
  contaFormatada:string = "";

  clientes: Cliente[] = [];
  clienteAux: Cliente = new Cliente();
  

  constructor(
    private clienteService: ClienteService,
    private router: Router,
    private loginService: LoginService,
    public snackBarService: SnackBarService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {

    this.loading = true;
    //Armazena dados do cliente logado
    this.clienteService.getClienteLogado().subscribe({
      next: (response: any) => {
        this.clienteLogado = response;
      },
      error: (err) => {this.loginService.handleHttpErrors(err)},
      complete: () => {

        this.clienteService.getContaFromCliente(this.clienteLogado.id!).subscribe({
          next: (response: any) => {
            this.contaCliente = response;
            this.contaFormatada = this.clienteService.formatarNumConta(this.contaCliente.id!);
          },
          error: (err) => {this.loginService.handleHttpErrors(err)},
          complete: () => {this.loading = false}
        });
      }
    });

  }

  openDialog(operacao: string, conta: Conta): void {
    const popup = this.dialog.open(DialogComponent, {
      data: {
        op: operacao,
        conta: conta,
      },
    });
  }

  logout(): void {
    this.loginService.logout();
    this.snackBarService.mostrarSnackBar("Sua sessão foi encerrada. Até Logo!", true);
    this.router.navigate(['/login']);
  }
}
