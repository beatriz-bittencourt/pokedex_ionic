import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-ficha-pokemon',
  templateUrl: './ficha-pokemon.page.html',
  styleUrls: ['./ficha-pokemon.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
  ],
})
export class FichaPokemonPage {
  @Input() pokemon: any;
}
