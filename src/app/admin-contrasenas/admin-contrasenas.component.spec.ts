import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminContrasenasComponent } from './admin-contrasenas.component';

describe('AdminContrasenasComponent', () => {
  let component: AdminContrasenasComponent;
  let fixture: ComponentFixture<AdminContrasenasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminContrasenasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminContrasenasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
