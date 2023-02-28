import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';

import { Cliente } from 'src/app/shared/models/cliente.model';
import { Gerente } from 'src/app/shared';
import { ConfirmationDialogComponent } from 'src/app/shared';
import { RecusarPedidoAutocadastroDialogComponent } from '../recusar-pedido-autocadastro-dialog';

import { GerenteService } from '../services';
import { LoginService } from 'src/app/auth/services/login.service';
import { SnackBarService } from 'src/app/shared';
import { ClienteService } from 'src/app/cliente/services/cliente.service';

@Component({
  selector: 'app-listar-pedidos-autocadatro',
  templateUrl: './listar-pedidos-autocadatro.component.html',
  styleUrls: ['./listar-pedidos-autocadatro.component.css']
})
export class ListarPedidosAutocadatroComponent implements OnInit {

  /* Paginação e Ordenação */
  @ViewChild(MatPaginator, { static: true }) public paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  /* Atributos */
  gerenteLogado: Gerente = new Gerente();
  pedidosAutocadastro: Cliente[] = [];

  /* Tabela */
  dataSource!: MatTableDataSource<Cliente>;
  displayedColumns: string[] = ['cpf', 'nome', 'salario', 'actions'];

  constructor(
    private router: Router,
    private gerenteService: GerenteService,
    private clienteService: ClienteService,
    private loginService: LoginService,
    public snackBarService: SnackBarService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {

    // busca os dados do gerente logado
    this.gerenteService.getGerenteLogado().subscribe({
      next: (response: any) => {
        this.gerenteLogado = response;
      },
      error: (err) => {
        this.loginService.handleHttpErrors(err);
      },
      complete: () => {
        // inicializa a tabela e lista pedidos de autocadastro
        this.dataSource = new MatTableDataSource(this.pedidosAutocadastro);
        this.listarPedidosAutocadastro();
      }
    });

  }

  listarPedidosAutocadastro(): void {

    // lista todos os pedidos de autocadastro do gerente
    this.gerenteService.listarPedidosAutocadastro(this.gerenteLogado.id!).subscribe({
      next: (clientes: Cliente[]) => {
        this.pedidosAutocadastro = clientes
        this.dataSource.data = this.pedidosAutocadastro
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: (err) => {
        this.loginService.handleHttpErrors(err)
      }
    });

  }

  aprovarPedido(cliente: Cliente): void {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Aprovar Pedido de Autocadastro',
        message: "Você tem certeza que deseja aprovar o pedido de autocadastro do(a) cliente: " + cliente.nome + "?",
        message2: "Um e-mail contendo a senha provisória de acesso será enviado ao cliente.",
        confirmButtonText: 'Aprovar',
        confirmButtonClass: "button-aprove"
      },
    });

    dialogRef.beforeClosed().subscribe(confirmed => {
      if (confirmed) {

        // seta aprovado como true e atualiza o cliente
        cliente.aprovado = true;
        this.clienteService.putCliente(cliente).subscribe({
          next: (cliente: Cliente) => {

          },
          error: (err) => {
            this.loginService.handleHttpErrors(err)
          },
          complete: () => {
            // atualiza a lista de pedidos de autocadastro
            this.listarPedidosAutocadastro();
            // exibe mensagem de sucesso na tela
            this.snackBarService.mostrarSnackBar('Pedido de autocadastro aprovado e e-mail de confirmação enviado com sucesso!', true, 6000)
          }
        });

      }
    });
  }

  recusarPedido(cliente: Cliente): void {
    let dialogRef = this.dialog.open(RecusarPedidoAutocadastroDialogComponent, {
      data: {
        title: 'Recusar Pedido de Autocadastro',
        message: "Você tem certeza que deseja recusar o pedido de autocadastro do(a) cliente: " + cliente.nome + "?",
        message2: "Um e-mail contendo a justificativa será enviado ao cliente.",
        confirmButtonText: 'Recusar'
      },
    });

    dialogRef.beforeClosed().subscribe(dialogResult => {
      if (dialogResult.value) {

        // seta aprovado como false e seta também a justificativa da reprovação para posterior envio de e-mail
        cliente.aprovado = false;
        cliente.mensagemReprovacao = dialogResult.justificativa

        this.clienteService.putCliente(cliente).subscribe({
          next: (cliente: Cliente) => {

          },
          error: (err) => {
            this.loginService.handleHttpErrors(err)
          },
          complete: () => {
            // atualiza a lista de pedidos de autocadastro
            this.listarPedidosAutocadastro();
            // exibe mensagem de sucesso na tela
            this.snackBarService.mostrarSnackBar('Pedido de autocadastro reprovado e e-mail com a justificativa enviado com sucesso!', true, 6000)
          }
        });

      }
    });
  }

  logout(): void {
    this.loginService.logout();
    this.snackBarService.mostrarSnackBar("Sua sessão foi encerrada. Até Logo!", true, 3000);
    this.router.navigate(['/login']);
  }

}
