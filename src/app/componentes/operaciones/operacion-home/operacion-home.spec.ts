import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperacionHome } from './operacion-home';

describe('OperacionHome', () => {
  let component: OperacionHome;
  let fixture: ComponentFixture<OperacionHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OperacionHome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OperacionHome);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
