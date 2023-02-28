import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

import { DetalhesClienteDialogComponent } from '../detalhes-cliente-dialog/detalhes-cliente-dialog.component';

import { Cliente } from 'src/app/shared/models/cliente.model';
import { Conta, Gerente } from 'src/app/shared';

import { GerenteService } from '../services';
import { ClienteService } from 'src/app/cliente/services/cliente.service';
import { LoginService } from 'src/app/auth/services/login.service';
import { SnackBarService } from 'src/app/shared';

/* Tipo referente ao datasource da tabela */
export interface ClienteSaldo {
  nome: string,               // Atributos para auxiliar na ordenação e filtragem e não precisar utilizar nested attributes
  cpf: string,
  cliente: Cliente,
  conta: Conta
};

@Component({
  selector: 'app-listar-clientes',
  templateUrl: './listar-clientes.component.html',
  styleUrls: ['./listar-clientes.component.css']
})
export class ListarClientesComponent implements OnInit {

  /* Paginação e Ordenação */
  @ViewChild(MatPaginator, { static: true }) public paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  /* Atributos */
  gerenteLogado: Gerente = new Gerente();
  listaClientes: ClienteSaldo[] = [];

  /* Tabela */
  dataSource!: MatTableDataSource<ClienteSaldo>;
  displayedColumns: string[] = ['cpf', 'nome', 'cidade', 'estado', 'saldo', 'actions'];

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
        this.dataSource = new MatTableDataSource(this.listaClientes);
        this.listarClientes();
      }
    });

  }

  listarClientes(): void {

    // lista todos os clientes do gerente
    this.gerenteService.listarClientes(this.gerenteLogado.id!).subscribe({
      next: (clientes: Cliente[]) => {

        // para cada cliente listado
        clientes.forEach((cliente) => {

          // busca os dados da conta do cliente
          this.clienteService.getContaFromCliente(cliente.id!).subscribe({
            next: (conta: Conta) => {

              this.listaClientes.push({
                nome: cliente.nome!,
                cpf: cliente.cpf!,
                cliente: cliente,
                conta: conta
              })

            },
            error: (err) => {
              this.loginService.handleHttpErrors(err);
            },
            complete: () => {
              this.dataSource.data = this.listaClientes;
              this.dataSource.sort = this.sort;
              this.dataSource.paginator = this.paginator;
            }
          });

        });

      },
      error: (err) => {
        this.loginService.handleHttpErrors(err)
      }
    });

  }

  filtrarClientes(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
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
