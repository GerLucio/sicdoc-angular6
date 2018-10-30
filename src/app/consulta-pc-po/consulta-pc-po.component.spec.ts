import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaPcPoComponent } from './consulta-pc-po.component';

describe('ConsultaPcPoComponent', () => {
  let component: ConsultaPcPoComponent;
  let fixture: ComponentFixture<ConsultaPcPoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultaPcPoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaPcPoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
