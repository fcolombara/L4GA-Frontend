import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperacionCremer } from './operacion-cremer';

describe('OperacionCremer', () => {
  let component: OperacionCremer;
  let fixture: ComponentFixture<OperacionCremer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OperacionCremer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OperacionCremer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
