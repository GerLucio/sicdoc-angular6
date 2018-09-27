import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUpdateDocsgenComponent } from './admin-update-docsgen.component';

describe('AdminUpdateDocsgenComponent', () => {
  let component: AdminUpdateDocsgenComponent;
  let fixture: ComponentFixture<AdminUpdateDocsgenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminUpdateDocsgenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminUpdateDocsgenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
