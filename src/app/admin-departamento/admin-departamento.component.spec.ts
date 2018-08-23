import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDepartamentoComponent } from './admin-departamento.component';

describe('AdminDepartamentoComponent', () => {
  let component: AdminDepartamentoComponent;
  let fixture: ComponentFixture<AdminDepartamentoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminDepartamentoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDepartamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
