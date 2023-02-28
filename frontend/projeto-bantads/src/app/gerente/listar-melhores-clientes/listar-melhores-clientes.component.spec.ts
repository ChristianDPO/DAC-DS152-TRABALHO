import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarMelhoresClientesComponent } from './listar-melhores-clientes.component';

describe('ListarMelhoresClientesComponent', () => {
  let component: ListarMelhoresClientesComponent;
  let fixture: ComponentFixture<ListarMelhoresClientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListarMelhoresClientesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarMelhoresClientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
