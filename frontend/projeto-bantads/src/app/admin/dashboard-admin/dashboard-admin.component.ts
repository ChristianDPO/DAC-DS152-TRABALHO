import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog'

import { Cliente, Conta, Gerente, SnackBarService, User } from 'src/app/shared';

import { AdminService } from '../services/admin.service';
import { LoginService } from '../../auth/services/login.service';
import { GerenteService } from 'src/app/gerente';
import { ClienteService } from 'src/app/cliente/services/cliente.service';

@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.css']
})
export class DashboardAdminComponent implements OnInit {

  /* Paginacao e Ordenacao */
  @ViewChild(MatPaginator, { static: true }) public paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  /* Atributos */
  usuarioLogado!: User;
  listaGerentes: Gerente[] = [];
  listaContas: Conta[] = [];
  numeroClientes!: number;
  totalSaldosPositivos!: number;
  totalSaldosNegativos!: string;

  /* Tabela */
  dataSource!: MatTableDataSource<Gerente>;
  displayedColumns: string[] = ['nome', 'numClientes', 'totalSaldosPositivos', 'totalSaldosNegativos'];

  constructor(
    private router: Router,
    private adminService: AdminService,
    private gerenteService: GerenteService,
    private clieteService: ClienteService,
    private loginService: LoginService,
    public snackBarService: SnackBarService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {

    this.usuarioLogado = this.loginService.usuarioLogado;

    // busca informações gerais do dashboard
    this.listarInformacoes();

    // inicializa a tabela e lista gerentes
    this.dataSource = new MatTableDataSource(this.listaGerentes);
    this.listarGerentes();

  }

  listarInformacoes(): void {

    this.clieteService.listarClientes().subscribe({
      next: (clientes: Cliente[]) => {
        this.numeroClientes = clientes.length
      },
      error: (err) => {
        this.loginService.handleHttpErrors(err)
      }
    });

    this.adminService.listarContas().subscribe({
      next: (contas: Conta[]) => {

        this.listaContas = contas;

        this.totalSaldosPositivos = contas.reduce((accumulator, object) => {
          if (object.saldo! > 0)
            return accumulator + object.saldo!;
          else
            return accumulator;
        }, 0);

        const auxSoma = contas.reduce((accumulator, object) => {
          if (object.saldo! < 0)
            return accumulator + object.saldo!;
          else
            return accumulator;
        }, 0);

        this.totalSaldosNegativos = auxSoma.toString().replace('-', '')

      },
      error: (err) => {
        this.loginService.handleHttpErrors(err)
      }
    });

  }

  listarGerentes(): void {

    // lista todos os gerentes do sistema
    this.gerenteService.listarGerentes().subscribe({
      next: (gerentes: Gerente[]) => {

        // para cada gerente listado
        gerentes.forEach((gerente) => {

          // busca as informações sobre número de clientes e totalização de saldos
          this.gerenteService.listarClientes(gerente.id!).subscribe({
            next: (clientes: Cliente[]) => {

              gerente.numClientes = clientes.length
              gerente.totalSaldosPositivos = 0;
              gerente.totalSaldosNegativos = 0;

              if (gerente.numClientes > 0) {

                clientes.forEach((cliente) => {
                  this.listaContas.forEach((conta) => {
                    if (cliente.id === conta.idCliente) {
                      if (conta.saldo! > 0) gerente.totalSaldosPositivos = gerente.totalSaldosPositivos + conta.saldo!
                      else gerente.totalSaldosNegativos = gerente.totalSaldosNegativos + conta.saldo!
                    }
                  })
                })

              }

              this.listaGerentes.push(gerente)

            },
            error: (err) => {
              this.loginService.handleHttpErrors(err)
            },
            complete: () => {
              this.dataSource.data = this.listaGerentes;
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

  logout(): void {
    this.loginService.logout();
    this.snackBarService.mostrarSnackBar("Sua sessão foi encerrada. Até Logo!", true, 3000);
    this.router.navigate(['/login']);
  }

}
