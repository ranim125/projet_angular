import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilePageComponent } from './profile-page.component';  // CORRIGÉ : nom de classe correct

describe('ProfilePageComponent', () => {  // CORRIGÉ : nom de la classe dans describe
  let component: ProfilePageComponent;  
  let fixture: ComponentFixture<ProfilePageComponent>;  // CORRIGÉ : type de fixture

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilePageComponent]  // CORRIGÉ : import du composant standalone
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfilePageComponent);  // CORRIGÉ : création du composant
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});