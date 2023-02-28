import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgForm } from '@angular/forms'

@Component({
  selector: 'app-recusar-pedido-autocadastro-dialog',
  templateUrl: './recusar-pedido-autocadastro-dialog.component.html',
  styleUrls: ['./recusar-pedido-autocadastro-dialog.component.css']
})
export class RecusarPedidoAutocadastroDialogComponent implements OnInit {

  @ViewChild('formRecusar') formRecusar! : NgForm;

  justificativa! : string;

  title: string;
  message: string;
  message2: string;

  confirmButtonText: string;
  cancelButtonText: string;

  confirmButtonClass: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<RecusarPedidoAutocadastroDialogComponent>
  ) {

    this.title = 'Confirmar';
    this.message = 'Deseja mesmo confirmar esta ação ?';
    this.message2 = '';
    this.confirmButtonText = 'Confirmar';
    this.cancelButtonText = 'Cancelar';
    this.confirmButtonClass = 'button-remove';

    if (this.data) {
      if ("title" in this.data) {
        this.title = data["title"];
      }
      if ("message" in this.data) {
        this.message = data["message"];
      }
      if ("message2" in this.data) {
        this.message2 = data["message2"];
      }
      if ("confirmButtonText" in this.data) {
        this.confirmButtonText = data["confirmButtonText"];
      }
      if ("cancelButtonText" in this.data) {
        this.cancelButtonText = data["cancelButtonText"];
      }
      if ("confirmButtonClass" in this.data) {
        this.confirmButtonClass = data["confirmButtonClass"];
      }
    }

  }

  ngOnInit(): void {
    this.justificativa = '';
  }

  confirmar(value: boolean) {
    let dialogResult = {
      value: value,
      justificativa: this.justificativa
    }
    this.dialogRef.close(dialogResult)
  }

}
