import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';

import { ConsultarClienteComponent } from './consultar-cliente';
import { ListarClientesComponent } from './listar-clientes';
import { ListarMelhoresClientesComponent } from './listar-melhores-clientes';
import { ListarPedidosAutocadatroComponent } from './listar-pedidos-autocadatro';

import { GerenteService } from './services';
import { RecusarPedidoAutocadastroDialogComponent } from './recusar-pedido-autocadastro-dialog';
import { DetalhesClienteDialogComponent } from './detalhes-cliente-dialog/detalhes-cliente-dialog.component';

import { IConfig, NgxMaskModule } from 'ngx-mask'
export const option: Partial<IConfig> | (() => Partial<IConfig>) = {};

import { SharedModule } from 'src/app/shared';

@NgModule({
  declarations: [
    ConsultarClienteComponent,
    ListarClientesComponent,
    ListarMelhoresClientesComponent,
    ListarPedidosAutocadatroComponent,
    RecusarPedidoAutocadastroDialogComponent,
    DetalhesClienteDialogComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatDialogModule,
    SharedModule,
    NgxMaskModule.forRoot(),
  ],
  exports: [
    ConsultarClienteComponent,
    ListarClientesComponent,
    ListarMelhoresClientesComponent,
    ListarPedidosAutocadatroComponent,
    RecusarPedidoAutocadastroDialogComponent,
    DetalhesClienteDialogComponent
  ],
  providers: [
    GerenteService
  ]
})
export class GerenteModule { }
