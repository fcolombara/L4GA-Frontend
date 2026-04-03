import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperacionDashboard } from './operacion-dashboard';

describe('OperacionDashboard', () => {
  let component: OperacionDashboard;
  let fixture: ComponentFixture<OperacionDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OperacionDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OperacionDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
