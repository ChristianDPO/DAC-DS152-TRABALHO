import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {

  constructor(public snackBar: MatSnackBar) { }

  mostrarSnackBar(message:string, is_success:boolean = false, duration:number = 3000) {
    this.snackBar.open(message, '', {
      duration: duration,
      verticalPosition: 'top',
      panelClass: [is_success? 'success-snackbar': 'fail-snackbar'],
    }); 
  }

}
