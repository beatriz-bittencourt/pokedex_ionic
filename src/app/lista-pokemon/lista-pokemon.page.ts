import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { FichaPokemonPage } from '../ficha-pokemon/ficha-pokemon.page';

@Component({
  selector: 'app-lista-pokemon',
  templateUrl: './lista-pokemon.page.html',
  styleUrls: ['./lista-pokemon.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    FichaPokemonPage,
  ],
})
export class ListaPokemonPage {
  pokemons: any[] = [];
  paginaAtual = 0;
  limitePorPagina = 15;

  async ngOnInit() {
    await this.carregarPokemons();
  }

  async carregarPokemons() {
    const offset = this.paginaAtual * this.limitePorPagina;
    const resposta = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=${this.limitePorPagina}&offset=${offset}`
    );
    const dados = await resposta.json();

    this.pokemons = await Promise.all(
      dados.results.map(async (p: any) => {
        const id = Number(p.url.split('/').filter(Boolean).pop());
        const detalhes = await fetch(p.url);
        const dadosDetalhes = await detalhes.json();

        const tipos = dadosDetalhes.types.map((t: any) => t.type.name);

        return {
          id,
          nome: p.name,
          imagem: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
          tipos,
        };
      })
    );
  }

  async proximaPagina() {
    this.paginaAtual++;
    await this.carregarPokemons();
  }

  async paginaAnterior() {
    if (this.paginaAtual > 0) {
      this.paginaAtual--;
      await this.carregarPokemons();
    }
  }
}
