import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCodComponent } from './admin-cod.component';

describe('AdminCodComponent', () => {
  let component: AdminCodComponent;
  let fixture: ComponentFixture<AdminCodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminCodComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
