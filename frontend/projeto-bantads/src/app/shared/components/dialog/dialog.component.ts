import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { DateAdapter } from '@angular/material/core';
import { formatDate } from "@angular/common";
import { DatePipe } from '@angular/common'


import { Conta } from 'src/app/shared';
import { Movimentacao } from '../../models/movimentacao.model';

import { ContaService } from '../../../cliente/services/conta.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})

export class DialogComponent implements OnInit {

  ngOnInit(): void {

  }

  /* Tabela Consulta de Saldo */
  contaCliente: Conta = this.data.conta;
  displayedColumnsSaldo: string[] = ['saldo', 'limite'];
  elementosTabelaSaldo = [this.data.conta];

  /* Tabela Extrato */
  elementosTabela: Movimentacao[] = [];
  datas: Date[] = [];
  datass: any[] = [];
  result = false;
  displayedColumnsData: string[] = ['Data', 'Movimentacoes', 'Saldo',];


  constructor(
    @Inject(MAT_DIALOG_DATA) 
    public data: any, 
    private dateAdapter: DateAdapter<Date>, 
    public datepipe: DatePipe,
    public contaService: ContaService
    ) {
    
    if(data.op == "Extrato"){
      this.contaService.buscarMovimentacaoPorConta(this.contaCliente.id!).subscribe({
        next: (response: Movimentacao[]) => {
          this.elementosTabela = response;
        },
        error: (err: any) => {
          this.contaService.handleHttpErrors(err);
        }
      })
    }

    this.contaCliente = data.conta;
    this.elementosTabelaSaldo = [data.conta];
    this.dateAdapter.setLocale('pt'); //Configra input no modelo dd/MM/yyyy

  }


  mostrarResult(): void {
    let saldo: number | undefined;
    saldo = 0;
    for (let i = 0; i < this.datas.length; i++) {//percorrendo pela qtd de datas seleciondas
      let valores = [];
      for (let x = 0; x < this.elementosTabela.length; x++) {//percorre todas as movimentacoes
        let datatabela = new Date(this.elementosTabela[x].dataHora || new Date()).toLocaleDateString();
        let dataseletor = this.datas[i].toLocaleDateString();
        if (datatabela == dataseletor) {//se as datas forem iguais
          valores.push(this.elementosTabela[x]);//adiciona a movimentacao com a data em "valores"
          saldo = this.elementosTabela[x].saldoApos || 0;
        }
      }

      this.datass.push({
        data: this.datas[i].toLocaleDateString(),
        saldo: saldo,
        movimentacoes: valores,
      });
    }
    this.result = true;
  }

  converter(data: string): string {
    let result = "";
    result = data[6] + data[7] + data[8] + data[9] + "/" + data[3] + data[4] + "/" + data[0] + data[1];
    return result;
  }

  filtrar(dataInicial: string, dataFim: string) {
    let dataI = new Date(this.converter(dataInicial));
    let dataF = new Date(this.converter(dataFim));

    let milisegundos = dataF.getTime() - dataI.getTime();
    let dias = Math.ceil(milisegundos / (1000 * 3600 * 24));

    this.datas.length = 0;//"limpa" o vetor

    for (let i = 0; i <= dias; i++) {
      let aux = dataI;
      this.datas.push(new Date());
      this.datas[i].setDate(dataI.getDate() + i);
    }
    this.result = false;
    this.mostrarResult();
  }

}

