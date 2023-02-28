import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { Conta, EnderecoCliente, Gerente } from 'src/app/shared';
import { Cliente } from 'src/app/shared/models/cliente.model';

import { GerenteService } from '../services';
import { LoginService } from 'src/app/auth/services/login.service';
import { SnackBarService } from 'src/app/shared';
import { ClienteService } from 'src/app/cliente/services/cliente.service';

@Component({
  selector: 'app-consultar-cliente',
  templateUrl: './consultar-cliente.component.html',
  styleUrls: ['./consultar-cliente.component.css']
})
export class ConsultarClienteComponent implements OnInit {

  @ViewChild('formConsultaCliente') formConsultaCliente!: NgForm;

  /* Atributos */
  gerenteLogado: Gerente = new Gerente();
  cpfConsulta !: string;
  cliente: Cliente = new Cliente();
  endereco: EnderecoCliente = new EnderecoCliente();
  conta: Conta = new Conta();
  contaFormatada: string = "";

  /* Tabelas */
  dataSource1!: Cliente[];
  dataSource2!: EnderecoCliente[];
  dataSource3!: Conta[];
  displayedColumns1: string[] = ['nome', 'email', 'cpf', 'salario'];
  displayedColumns2: string[] = ['tipo', 'logradouro', 'numero', 'complemento', 'cep', 'cidade', 'estado'];
  displayedColumns3: string[] = ['agencia', 'conta', 'abertura', 'saldo', 'limite'];

  constructor(
    private router: Router,
    private gerenteService: GerenteService,
    private clienteService: ClienteService,
    private loginService: LoginService,
    public snackBarService: SnackBarService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {

    this.dataSource1 = [this.cliente];
    this.dataSource2 = [this.endereco];
    this.dataSource3 = [this.conta];
    
    // busca os dados do gerente logado
    this.gerenteService.getGerenteLogado().subscribe({
      next: (response: any) => {
        this.gerenteLogado = response;
      },
      error: (err) => {
        this.loginService.handleHttpErrors(err);
      }
    });

  }

  consultarCliente(): void {

    // busca o cliente pelo cpf consultado
    this.clienteService.getClienteByCpf(this.cpfConsulta).subscribe({
      next: (cliente: any) => {

        this.clienteService.getContaFromCliente(cliente.id).subscribe({
          next: (conta: Conta) => {

            var dataHoraAbertura = new Date(conta.dataHoraAbertura!);
            var dataHoraFormatada = dataHoraAbertura.toLocaleString('pt-BR', { timeZone: 'UTC' });
            conta.dataHoraAbertura = dataHoraFormatada;

            this.contaFormatada = this.clienteService.formatarNumConta(conta.id!);

            this.dataSource1 = [cliente];
            this.dataSource2 = [cliente.endereco];
            this.dataSource3 = [conta];
          },
          error: (err) => {
            this.loginService.handleHttpErrors(err);
          }
        });

      },
      error: (err) => {
        // cliente não encontrado: zera a tabela e exibe snack bar de erro
        this.dataSource1 = [this.cliente];
        this.dataSource2 = [this.endereco];
        this.dataSource3 = [this.conta];
        this.loginService.handleHttpErrors(err);
      }
    });

  }

  validarCpf(cpf: string) {

    // opções inválidas
    if (cpf.length != 11 ||
      cpf == "00000000000" || cpf == "11111111111" || cpf == "22222222222" || cpf == "33333333333" || cpf == "44444444444" ||
      cpf == "55555555555" || cpf == "66666666666" || cpf == "77777777777" || cpf == "88888888888" || cpf == "99999999999"
    )
      this.formConsultaCliente.controls['cpf'].setErrors({ cpfInvalido: true });

    let dig = 0;
    let ver = 0;

    for (let i = 0; i < 9; i++)//para os 9 primeiros digitos
      dig += parseInt(cpf.charAt(i)) * (10 - i);//multiplica por seu peso e adiciona

    ver = 11 - (dig % 11);//recebe o 1° digito verificador

    if (ver == 10 || ver == 11)//caso for maior que 10 o dig fica 0 
      ver = 0;

    if (ver != parseInt(cpf.charAt(9)))//confere se o 1° digito verificador está correto
      this.formConsultaCliente.controls['cpf'].setErrors({ cpfInvalido: true });


    dig = 0;//passos para verificar o 2° digito verificador
    for (let i = 0; i < 10; i++)//para os 9 primeiros digitos + 1° digito verificador
      dig += parseInt(cpf.charAt(i)) * (11 - i);

    ver = 11 - (dig % 11); //recebe o 2° digito verificador

    if (ver == 10 || ver == 11)//caso for maior que 10 o dig fica 0 
      ver = 0;

    if (ver != parseInt(cpf.charAt(10)))//confere se o 2° digito verificador tbm está correto
      this.formConsultaCliente.controls['cpf'].setErrors({ cpfInvalido: true });

    return;
  }

  logout(): void {
    this.loginService.logout();
    this.snackBarService.mostrarSnackBar("Sua sessão foi encerrada. Até Logo!", true, 3000);
    this.router.navigate(['/login']);
  }

}
