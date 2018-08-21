import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSubdireccionComponent } from './admin-subdireccion.component';

describe('AdminSubdireccionComponent', () => {
  let component: AdminSubdireccionComponent;
  let fixture: ComponentFixture<AdminSubdireccionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminSubdireccionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminSubdireccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
