import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecusarPedidoAutocadastroDialogComponent } from './recusar-pedido-autocadastro-dialog.component';

describe('RecusarPedidoAutocadastroDialogComponent', () => {
  let component: RecusarPedidoAutocadastroDialogComponent;
  let fixture: ComponentFixture<RecusarPedidoAutocadastroDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecusarPedidoAutocadastroDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecusarPedidoAutocadastroDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
