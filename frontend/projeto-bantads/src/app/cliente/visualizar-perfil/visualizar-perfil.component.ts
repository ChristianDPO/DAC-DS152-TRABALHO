import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ClienteService } from '../services/cliente.service';
import { LoginService } from '../../auth/services/login.service';
import { SnackBarService } from 'src/app/shared';

import { Cliente } from 'src/app/shared/models/cliente.model';
import { Conta } from 'src/app/shared';

@Component({
  selector: 'app-visualizar-perfil',
  templateUrl: './visualizar-perfil.component.html',
  styleUrls: ['./visualizar-perfil.component.css']
})
export class VisualizarPerfilComponent implements OnInit {

  /* Atributos */
  clienteLogado: Cliente = new Cliente();
  contaCliente: Conta = new Conta();
  contaFormatada: string = "";

  /* Tabela Cliente */
  displayedColumns1: string[] = ['nome', 'email', 'cpf', 'salario'];
  elementosTabela1 = [{
    nome: this.clienteLogado.nome!, 
    email: this.clienteLogado.email!, 
    cpf: this.clienteLogado.cpf!, 
    salario: this.clienteLogado.salario!
  }];

  /* Tabela Endereco */
  displayedColumns2: string[] = ['tipo', 'logradouro', 'numero', 'complemento', 'cep', 'cidade', 'estado'];
  elementosTabela2 = [{
    tipo: this.clienteLogado.endereco?.tipo!, 
    logradouro: this.clienteLogado.endereco?.logradouro!, 
    numero: this.clienteLogado.endereco?.numero!,
    complemento: this.clienteLogado.endereco?.complemento!,
    cep: this.clienteLogado.endereco?.cep!, 
    cidade: this.clienteLogado.endereco?.cidade!, 
    estado: this.clienteLogado.endereco?.estado!
  }];

  constructor(
    private clienteService: ClienteService, 
    private loginService: LoginService,
    private router: Router, 
    private snackBarService: SnackBarService
  ) { }

  ngOnInit(): void { 
    //Armazena dados do cliente logado
    this.clienteService.getClienteLogado().subscribe({
      next: (response: any) => {
        this.clienteLogado = response;
        this.elementosTabela1 = [{
          nome: this.clienteLogado.nome!, 
          email: this.clienteLogado.email!, 
          cpf: this.clienteLogado.cpf!, 
          salario: this.clienteLogado.salario!
        }];

        this.elementosTabela2 = [{
          tipo: this.clienteLogado.endereco?.tipo!, 
          logradouro: this.clienteLogado.endereco?.logradouro!, 
          numero: this.clienteLogado.endereco?.numero!,
          complemento: this.clienteLogado.endereco?.complemento!,
          cep: this.clienteLogado.endereco?.cep!, 
          cidade: this.clienteLogado.endereco?.cidade!, 
          estado: this.clienteLogado.endereco?.estado!
        }];

      },
      error: (err) => {this.loginService.handleHttpErrors(err)},
      complete: () => {
        
        //Armazena conta do cliente logado
        this.clienteService.getContaFromCliente(this.clienteLogado.id!).subscribe({
          next: (response: any) => {
            this.contaCliente = response;
            this.contaFormatada = this.clienteService.formatarNumConta(this.contaCliente.id!);
          },
          error: (err) => {this.loginService.handleHttpErrors(err)}
        });
      }
    });

  }

  logout(): void{
    this.loginService.logout();
    this.snackBarService.mostrarSnackBar("Sua sessão foi encerrada. Até Logo!", true);
    this.router.navigate(['/login']);
  }

}
