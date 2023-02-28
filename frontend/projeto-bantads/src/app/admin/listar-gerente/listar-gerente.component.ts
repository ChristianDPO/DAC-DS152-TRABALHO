import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';

import { Gerente, User } from 'src/app/shared';
import { ConfirmationDialogComponent } from 'src/app/shared'

import { AdminService } from '../services/admin.service';
import { LoginService } from '../../auth/services/login.service';
import { SnackBarService } from 'src/app/shared';
import { GerenteService } from 'src/app/gerente';

@Component({
  selector: 'app-listar-gerente',
  templateUrl: './listar-gerente.component.html',
  styleUrls: ['./listar-gerente.component.css']
})
export class ListarGerenteComponent implements OnInit {

  /* Paginacao e Ordenacao */
  @ViewChild(MatPaginator, {static: true}) public paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort!: MatSort;

  /* Atributos */
  usuarioLogado!: User;
  listaGerentes: Gerente[] = [];

  /* Tabela */
  dataSource!: MatTableDataSource<Gerente>;
  displayedColumns: string[] = ['cpf', 'nome', 'email', 'actions'];

  constructor(
    private router: Router,
    private gerenteService: GerenteService,
    private adminService: AdminService,
    private loginService: LoginService,
    public snackBarService: SnackBarService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    
    this.usuarioLogado = this.loginService.usuarioLogado;

    // inicializa a tabela e lista gerentes
    this.dataSource = new MatTableDataSource(this.listaGerentes);
    this.listarGerentes();
    
  }

  listarGerentes(): void {

    // lista todos os gerentes do sistema
    this.gerenteService.listarGerentes().subscribe({
      next: (gerentes: Gerente[]) => {
        this.listaGerentes = gerentes
        this.dataSource.data = this.listaGerentes
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      }, error: (err) => {
        this.loginService.handleHttpErrors(err)
      }
    });

  }

  logout(): void{
    this.loginService.logout();
    this.snackBarService.mostrarSnackBar("Sua sessão foi encerrada. Até Logo!", true);
    this.router.navigate(['/login']);
  }

  remover(gerente: Gerente){
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Excluir gerente',
        message: "Você tem certeza que deseja excluir o(a) gerente: " + gerente.nome + "?",
        confirmButtonText: 'Excluir'
      },
    });

    dialogRef.beforeClosed().subscribe(confirmed => {
      if (confirmed) {
        this.adminService.removerGerente(gerente).subscribe({
          next: (response: any) => {
            this.snackBarService.mostrarSnackBar("Gerente deletado com sucesso", true);
            this.router.navigate(['/gerentes/listar']);
          },
          error: (err: any) => {this.adminService.handleHttpErrors(err)}
        });
      }
    });
  }
}
