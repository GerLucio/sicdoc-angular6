import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDocsPendientesComponent } from './admin-docs-pendientes.component';

describe('AdminDocsPendientesComponent', () => {
  let component: AdminDocsPendientesComponent;
  let fixture: ComponentFixture<AdminDocsPendientesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminDocsPendientesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDocsPendientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
