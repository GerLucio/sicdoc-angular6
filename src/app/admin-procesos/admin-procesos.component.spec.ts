import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProcesosComponent } from './admin-procesos.component';

describe('AdminProcesosComponent', () => {
  let component: AdminProcesosComponent;
  let fixture: ComponentFixture<AdminProcesosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminProcesosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminProcesosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
