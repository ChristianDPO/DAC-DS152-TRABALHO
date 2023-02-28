import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Cliente } from 'src/app/shared/models/cliente.model';
import { Conta, EnderecoCliente } from 'src/app/shared';

import { ClienteService } from '../../cliente/services/cliente.service';

@Component({
  selector: 'app-detalhes-cliente-dialog',
  templateUrl: './detalhes-cliente-dialog.component.html',
  styleUrls: ['./detalhes-cliente-dialog.component.css']
})
export class DetalhesClienteDialogComponent implements OnInit {

  /* Atributos */
  cliente!: Cliente;
  conta!: Conta;
  contaFormatada:string = "";

  /* Tabelas */
  dataSource1!: Cliente[];
  dataSource2!: EnderecoCliente[];
  dataSource3!: Conta[];
  displayedColumns1: string[] = ['nome', 'email', 'cpf', 'salario'];
  displayedColumns2: string[] = ['tipo', 'logradouro', 'numero', 'complemento', 'cep', 'cidade', 'estado'];
  displayedColumns3: string[] = ['agencia', 'conta', 'abertura', 'saldo', 'limite'];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DetalhesClienteDialogComponent>,
    public clienteService: ClienteService
  ) { }

  ngOnInit(): void {

    this.cliente = this.data["cliente"];
    this.conta = this.data["conta"];
    this.contaFormatada = this.clienteService.formatarNumConta(this.conta.id!);

    var dataHoraAbertura = new Date(this.conta.dataHoraAbertura!);
    var dataHoraFormatada = dataHoraAbertura.toLocaleString('pt-BR');
    this.conta.dataHoraAbertura = dataHoraFormatada;

    this.dataSource1 = [this.cliente];
    this.dataSource2 = [this.cliente.endereco!];
    this.dataSource3 = [this.conta];

  }

  confirmar(value: boolean) {
    this.dialogRef.close(value)
  }

}
