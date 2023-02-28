import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';

import { DetalhesClienteDialogComponent } from '../detalhes-cliente-dialog/detalhes-cliente-dialog.component';

import { Cliente } from 'src/app/shared/models/cliente.model';
import { Conta, Gerente } from 'src/app/shared';

import { GerenteService } from '../services';
import { ClienteService } from 'src/app/cliente/services/cliente.service';
import { LoginService } from 'src/app/auth/services/login.service';
import { SnackBarService } from 'src/app/shared';

/* Tipo referente ao datasource da tabela */
export interface ClienteSaldo {
  saldo: number,              // Atributo para auxiliar na ordenação e não precisar utilizar nested attributes
  cliente: Cliente,
  conta: Conta
};

@Component({
  selector: 'app-listar-melhores-clientes',
  templateUrl: './listar-melhores-clientes.component.html',
  styleUrls: ['./listar-melhores-clientes.component.css']
})
export class ListarMelhoresClientesComponent implements OnInit {

  /* Ordenação */
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  /* Atributos */
  gerenteLogado: Gerente = new Gerente();
  melhoresClientes: ClienteSaldo[] = []

  /* Tabela */
  dataSource!: MatTableDataSource<ClienteSaldo>;
  displayedColumns: string[] = ['fav', 'cpf', 'nome', 'cidade', 'estado', 'saldo', 'actions'];

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
        // inicializa a tabela e lista clientes
        this.dataSource = new MatTableDataSource(this.melhoresClientes);
        this.listarMelhoresClientes();
      }
    });

  }

  listarMelhoresClientes(): void {

    let lista: ClienteSaldo[] = []

    // lista todos os clientes do gerente
    this.gerenteService.listarMelhoresClientes(this.gerenteLogado.id!).subscribe({
      next: (clientes: Cliente[]) => {

        // para cada cliente listado
        clientes.forEach((cliente) => {

          // busca os dados da conta do cliente
          this.clienteService.getContaFromCliente(cliente.id!).subscribe({
            next: (conta: Conta) => {

              lista.push({
                saldo: conta.saldo!,
                cliente: cliente,
                conta: conta
              })

            },
            error: (err) => {
              this.loginService.handleHttpErrors(err)
            },
            complete: () => {
              // ordena por saldo e seleciona os 5 melhores clientes
              this.dataSource.data = lista.sort(function (a, b) {
                return b.saldo - a.saldo;
              }).slice(0,5)
              this.dataSource.sort = this.sort;
            }
          });

        });

      },
      error: (err) => {
        this.loginService.handleHttpErrors(err)
      }
    });

  }

  exibirDetalhesCliente(cliente: Cliente, conta: Conta) {
    this.dialog.open(DetalhesClienteDialogComponent, {
      data: {
        cliente,
        conta
      }
    });
  }

  logout(): void {
    this.loginService.logout();
    this.snackBarService.mostrarSnackBar("Sua sessão foi encerrada. Até Logo!", true);
    this.router.navigate(['/login']);
  }

}
