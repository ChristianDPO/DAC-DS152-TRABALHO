import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsultarClienteComponent } from './gerente';
import { ListarPedidosAutocadatroComponent } from './gerente/listar-pedidos-autocadatro';
import { ListarMelhoresClientesComponent } from './gerente/listar-melhores-clientes';
import { ListarClientesComponent } from './gerente/listar-clientes';

import { CadastrarClienteComponent } from './cliente/cadastrar-cliente/cadastrar-cliente.component';
import { DepositarComponent } from './cliente/depositar/depositar.component';
import { ListarOperacoesComponent } from './cliente/listar-operacoes/listar-operacoes.component';
import { SacarComponent } from './cliente/sacar/sacar.component';
import { TransferirComponent } from './cliente/transferir/transferir.component';
import { VisualizarPerfilComponent } from './cliente/visualizar-perfil/visualizar-perfil.component';

import { ListarGerenteComponent } from './admin/listar-gerente/listar-gerente.component';
import { EditarGerenteComponent } from './admin/editar-gerente/editar-gerente.component';
import { InserirGerenteComponent } from './admin/inserir-gerente/inserir-gerente.component';
import { DashboardAdminComponent } from './admin/dashboard-admin/dashboard-admin.component';

import { LoginComponent } from './auth/login/login.component';

import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'home-gerente',
    redirectTo: 'gerente'
  },
  {
    path: 'home-admin',
    component: DashboardAdminComponent,
    canActivate: [AuthGuard],
    data: {
      role: 'ADM'
    }
  },
  {
    path: 'gerentes',
    redirectTo: 'gerentes/listar'
  },
  {
    path: 'gerentes/listar',
    component: ListarGerenteComponent,
    canActivate: [AuthGuard],
    data: {
      role: 'ADM'
    }
  },
  {
    path: 'gerentes/inserir',
    component: InserirGerenteComponent,
    canActivate: [AuthGuard],
    data: {
      role: 'ADM'
    }
  },
  {
    path: 'gerentes/editar/:id',
    component: EditarGerenteComponent,
    canActivate: [AuthGuard],
    data: {
      role: 'ADM'
    }
  },
  {
    path: 'new',
    component: CadastrarClienteComponent
  },
  {
    path: 'home-cliente',
    component: ListarOperacoesComponent,
    canActivate: [AuthGuard],
    data: {
      role: 'CLI'
    }
  },
  {
    path: 'depositar',
    component: DepositarComponent,
    canActivate: [AuthGuard],
    data: {
      role: 'CLI'
    }
  },
  {
    path: 'sacar',
    component: SacarComponent,
    canActivate: [AuthGuard],
    data: {
      role: 'CLI'
    }
  },
  {
    path: 'transferir',
    component: TransferirComponent,
    canActivate: [AuthGuard],
    data: {
      role: 'CLI'
    }
  },
  {
    path: 'perfil',
    component: VisualizarPerfilComponent,
    canActivate: [AuthGuard],
    data: {
      role: 'CLI'
    }
  },
  {
    path: 'gerente',
    component: ListarPedidosAutocadatroComponent,
    canActivate: [AuthGuard],
    data: {
      role: 'GER'
    }
  },
  {
    path: 'gerente/listar-clientes',
    component: ListarClientesComponent,
    canActivate: [AuthGuard],
    data: {
      role: 'GER'
    }
  },
  {
    path: 'gerente/listar-melhores-clientes',
    component: ListarMelhoresClientesComponent,
    canActivate: [AuthGuard],
    data: {
      role: 'GER'
    }
  },
  {
    path: 'gerente/consultar-cliente',
    component: ConsultarClienteComponent,
    canActivate: [AuthGuard],
    data: {
      role: 'GER'
    }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
