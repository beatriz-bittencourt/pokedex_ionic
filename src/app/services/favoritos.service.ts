import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FavoritosService {
  private favoritos = new BehaviorSubject<any[]>(this.carregarFavoritos());
  favoritos$ = this.favoritos.asObservable();

  private carregarFavoritos(): any[] {
    return JSON.parse(localStorage.getItem('favoritos') || '[]');
  }

  private salvarFavoritos(favs: any[]) {
    localStorage.setItem('favoritos', JSON.stringify(favs));
    this.favoritos.next(favs);
  }

  alterarFavorito(pokemon: any) {
    const atual = [...this.favoritos.getValue()];
    const index = atual.findIndex((p) => p.id === pokemon.id);

    if (index > -1) {
      atual.splice(index, 1);
    } else {
      atual.push(pokemon);
    }

    this.salvarFavoritos(atual);
  }

  eFavorito(id: number): boolean {
    return this.favoritos.getValue().some((p) => p.id === id);
  }

  getFavoritos(): any[] {
    return this.favoritos.getValue();
  }
}
