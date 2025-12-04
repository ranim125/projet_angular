import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DelivererForm } from './deliverer-form';

describe('DelivererForm', () => {
  let component: DelivererForm;
  let fixture: ComponentFixture<DelivererForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DelivererForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DelivererForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
