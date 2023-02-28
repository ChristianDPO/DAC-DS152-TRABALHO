import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css']
})
export class ConfirmationDialogComponent implements OnInit {

  title:string;
  message:string;
  message2:string;

  confirmButtonText:string;
  cancelButtonText:string;

  confirmButtonClass:string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>
    ) { 
      
      this.title = 'Confirmar';
      this.message = 'Deseja mesmo confirmar esta ação ?';
      this.message2 = '';
      this.confirmButtonText = 'Confirmar';
      this.cancelButtonText = 'Cancelar';
      this.confirmButtonClass = 'button-remove';

      if(this.data){
        if("title" in this.data){
          this.title = data["title"];
        }
        if("message" in this.data){
          this.message = data["message"];
        }
        if("message2" in this.data){
          this.message2 = data["message2"];
        }
        if("confirmButtonText" in this.data){
          this.confirmButtonText = data["confirmButtonText"];
        }
        if("cancelButtonText" in this.data){
          this.cancelButtonText = data["cancelButtonText"];
        }
        if("confirmButtonClass" in this.data){
          this.confirmButtonClass = data["confirmButtonClass"];
        }       
      }

    }

  ngOnInit(): void {
  }

  confirmar(value:boolean){
    this.dialogRef.close(value)
  }

}
