import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClienteService } from './services/cliente.service';
import { CadastrarClienteComponent } from './cadastrar-cliente/cadastrar-cliente.component';
import { RouterModule } from '@angular/router';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';

import { ListarOperacoesComponent } from './listar-operacoes/listar-operacoes.component';
import { DepositarComponent } from './depositar/depositar.component';
import { SacarComponent } from './sacar/sacar.component';
import { TransferirComponent } from './transferir/transferir.component';
import { SharedModule } from 'src/app/shared';

import { MatDialogModule } from '@angular/material/dialog';
import { VisualizarPerfilComponent } from './visualizar-perfil/visualizar-perfil.component';
import { IConfig, NgxMaskModule } from 'ngx-mask';
// import { NgSelectModule } from '@ng-select/ng-select';
import { MatOptionModule } from '@angular/material/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatTableModule } from '@angular/material/table';
export const option: Partial<IConfig> | (() => Partial<IConfig>) = {};

import { ContaService } from './services/conta.service';


@NgModule({
  declarations: [
    CadastrarClienteComponent,
    ListarOperacoesComponent,
    DepositarComponent,
    SacarComponent,
    TransferirComponent,
    VisualizarPerfilComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatDialogModule,
    NgxMaskModule.forRoot(),
    MatTableModule,
    SharedModule
  ],
  exports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatDialogModule,
    FormsModule,
  ],
  providers: [
    ClienteService,
    ContaService
  ]
})
export class ClienteModule { }
