import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarOperacoesComponent } from './listar-operacoes.component';

describe('ListarOperacoesComponent', () => {
  let component: ListarOperacoesComponent;
  let fixture: ComponentFixture<ListarOperacoesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListarOperacoesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarOperacoesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
