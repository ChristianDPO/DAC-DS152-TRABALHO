import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';

import { NumericoDirective } from './directives/numerico.directive';
import { MinimoValidatorDirective } from './directives/minimo-validator.directive';

import { SnackBarService } from './services/snack-bar.service';


@NgModule({
  declarations: [
    ConfirmationDialogComponent,
    NumericoDirective,
    MinimoValidatorDirective,
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDialogModule,
    FormsModule,
  ],
  exports:[
    NumericoDirective,
    MinimoValidatorDirective
  ],
  providers: [
    SnackBarService,
    DatePipe
  ]
})
export class SharedModule { }
