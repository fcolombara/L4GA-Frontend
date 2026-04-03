import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperacionGreen } from './operacion-green';

describe('OperacionGreen', () => {
  let component: OperacionGreen;
  let fixture: ComponentFixture<OperacionGreen>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OperacionGreen]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OperacionGreen);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
