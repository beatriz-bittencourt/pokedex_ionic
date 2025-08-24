import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonCard, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { heart, heartOutline } from 'ionicons/icons';
import { FavoritosService } from '../../services/favoritos.service';

addIcons({ heart, 'heart-outline': heartOutline });

@Component({
  selector: 'app-ficha-pokemon',
  templateUrl: './ficha-pokemon.page.html',
  styleUrls: ['./ficha-pokemon.page.scss'],
  standalone: true,
  imports: [CommonModule, IonCard, IonIcon],
})
export class FichaPokemonPage {
  @Input() pokemon: any;

  constructor(private favoritosService: FavoritosService) {}

  favoritar(pokemon: any) {
    this.favoritosService.alterarFavorito(pokemon);
    pokemon.favorito = this.favoritosService.eFavorito(pokemon.id);
  }
}
