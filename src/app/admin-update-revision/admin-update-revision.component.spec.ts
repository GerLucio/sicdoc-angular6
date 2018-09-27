import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUpdateRevisionComponent } from './admin-update-revision.component';

describe('AdminUpdateRevisionComponent', () => {
  let component: AdminUpdateRevisionComponent;
  let fixture: ComponentFixture<AdminUpdateRevisionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminUpdateRevisionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminUpdateRevisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
