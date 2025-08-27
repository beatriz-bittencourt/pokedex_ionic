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
      import('../app/componentes/lista-pokemon/lista-pokemon.page').then(
        (m) => m.ListaPokemonPage
      ),
  },
  {
    path: 'ficha-pokemon',
    loadComponent: () =>
      import('../app/componentes/ficha-pokemon/ficha-pokemon.page').then(
        (m) => m.FichaPokemonPage
      ),
  },
  {
    path: 'favoritos',
    loadComponent: () =>
      import('./pagina/favoritos/favoritos.page').then((m) => m.FavoritosPage),
  },
  {
    path: 'detalhes/:id',
    loadComponent: () =>
      import('./pagina/detalhes/detalhes.page').then((m) => m.DetalhesPage),
  },
];
