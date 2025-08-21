import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FichaPokemonPage } from './ficha-pokemon.page';

describe('FichaPokemonPage', () => {
  let component: FichaPokemonPage;
  let fixture: ComponentFixture<FichaPokemonPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FichaPokemonPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
