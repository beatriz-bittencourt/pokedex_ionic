import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CabecalhoComponent } from '../../componentes/cabecalho/cabecalho.component';
import { ListaPokemonPage } from '../../../app/componentes/lista-pokemon/lista-pokemon.page';
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ListaPokemonPage,
    CabecalhoComponent,
  ],
})
export class HomePage implements OnInit {
  constructor() {}

  ngOnInit() {}
}
