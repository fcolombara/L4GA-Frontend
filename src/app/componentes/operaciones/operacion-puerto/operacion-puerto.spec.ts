import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperacionPuerto } from './operacion-puerto';

describe('OperacionPuerto', () => {
  let component: OperacionPuerto;
  let fixture: ComponentFixture<OperacionPuerto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OperacionPuerto]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OperacionPuerto);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
