import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroEtapas } from './registro-etapas';

describe('RegistroEtapas', () => {
  let component: RegistroEtapas;
  let fixture: ComponentFixture<RegistroEtapas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroEtapas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroEtapas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
