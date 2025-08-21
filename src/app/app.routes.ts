import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./pagina/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'lista-pokemon',
    loadComponent: () =>
      import('./lista-pokemon/lista-pokemon.page').then(
        (m) => m.ListaPokemonPage
      ),
  },
  {
    path: 'ficha-pokemon',
    loadComponent: () =>
      import('./ficha-pokemon/ficha-pokemon.page').then(
        (m) => m.FichaPokemonPage
      ),
  },
];
