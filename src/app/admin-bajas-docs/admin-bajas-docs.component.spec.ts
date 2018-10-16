import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBajasDocsComponent } from './admin-bajas-docs.component';

describe('AdminBajasDocsComponent', () => {
  let component: AdminBajasDocsComponent;
  let fixture: ComponentFixture<AdminBajasDocsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminBajasDocsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminBajasDocsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
