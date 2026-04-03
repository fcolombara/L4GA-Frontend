import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperacionGreenSalida } from './operacion-green-salida';

describe('OperacionGreenSalida', () => {
  let component: OperacionGreenSalida;
  let fixture: ComponentFixture<OperacionGreenSalida>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OperacionGreenSalida]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OperacionGreenSalida);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
