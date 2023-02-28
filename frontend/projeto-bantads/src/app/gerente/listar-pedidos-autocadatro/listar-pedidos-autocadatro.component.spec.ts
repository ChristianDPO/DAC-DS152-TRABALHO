import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarPedidosAutocadatroComponent } from './listar-pedidos-autocadatro.component';

describe('ListarPedidosAutocadatroComponent', () => {
  let component: ListarPedidosAutocadatroComponent;
  let fixture: ComponentFixture<ListarPedidosAutocadatroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListarPedidosAutocadatroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarPedidosAutocadatroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
