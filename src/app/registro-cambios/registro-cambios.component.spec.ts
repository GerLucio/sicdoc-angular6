import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroCambiosComponent } from './registro-cambios.component';

describe('RegistroCambiosComponent', () => {
  let component: RegistroCambiosComponent;
  let fixture: ComponentFixture<RegistroCambiosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistroCambiosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroCambiosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
