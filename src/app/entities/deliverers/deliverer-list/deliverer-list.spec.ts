import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DelivererList } from './deliverer-list';

describe('DelivererList', () => {
  let component: DelivererList;
  let fixture: ComponentFixture<DelivererList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DelivererList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DelivererList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
