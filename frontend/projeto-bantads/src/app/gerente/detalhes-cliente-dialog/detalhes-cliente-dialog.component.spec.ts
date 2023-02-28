import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalhesClienteDialogComponent } from './detalhes-cliente-dialog.component';

describe('DetalhesClienteDialogComponent', () => {
  let component: DetalhesClienteDialogComponent;
  let fixture: ComponentFixture<DetalhesClienteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalhesClienteDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalhesClienteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
