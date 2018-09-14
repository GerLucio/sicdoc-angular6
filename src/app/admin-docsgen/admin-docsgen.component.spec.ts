import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDocsgenComponent } from './admin-docsgen.component';

describe('AdminDocsgenComponent', () => {
  let component: AdminDocsgenComponent;
  let fixture: ComponentFixture<AdminDocsgenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminDocsgenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDocsgenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
