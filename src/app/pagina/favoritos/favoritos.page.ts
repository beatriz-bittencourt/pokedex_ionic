import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { CabecalhoComponent } from 'src/app/componentes/cabecalho/cabecalho.component';
import { FichaPokemonPage } from '../../componentes/ficha-pokemon/ficha-pokemon.page';
import { FavoritosService } from '../../services/favoritos.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.page.html',
  styleUrls: ['./favoritos.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    CommonModule,
    FormsModule,
    CabecalhoComponent,
    FichaPokemonPage,
  ],
})
export class FavoritosPage implements OnInit {
  favoritos: any[] = [];

  constructor(
    private favoritosService: FavoritosService,
    private router: Router
  ) {}

  ngOnInit() {
    this.favoritosService.favoritos$.subscribe((lista) => {
      this.favoritos = lista.map((pokemon) => ({
        ...pokemon,
        favorito: this.favoritosService.eFavorito(pokemon.id),
      }));
    });
  }

  favoritar(pokemon: any) {
    this.favoritosService.alterarFavorito(pokemon);
  }

  abrirDetalhes(id: number) {
    this.router.navigate(['/detalhes', id]);
  }
}
