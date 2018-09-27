import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPcPoComponent } from './admin-pc-po.component';

describe('AdminPcPoComponent', () => {
  let component: AdminPcPoComponent;
  let fixture: ComponentFixture<AdminPcPoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminPcPoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPcPoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
