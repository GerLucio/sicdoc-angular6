import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTiposDocsComponent } from './admin-tipos-docs.component';

describe('AdminTiposDocsComponent', () => {
  let component: AdminTiposDocsComponent;
  let fixture: ComponentFixture<AdminTiposDocsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminTiposDocsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminTiposDocsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
