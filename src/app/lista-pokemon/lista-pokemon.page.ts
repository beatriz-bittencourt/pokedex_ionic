import { Component, OnInit, ViewChild } from '@angular/core';
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
export class ListaPokemonPage implements OnInit {
  pokemons: any[] = [];
  paginaAtual = 0;
  limitePorPagina = 15;
  opcoesLimite = [5, 10, 15, 20, 50];

  totalPokemons = 0;

  @ViewChild(IonContent) conteudo!: IonContent;

  async ngOnInit() {
    await this.carregarPokemons();
  }

  async carregarPokemons() {
    const offset = this.paginaAtual * this.limitePorPagina;
    const resposta = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=${this.limitePorPagina}&offset=${offset}`
    );
    const dados = await resposta.json();
    this.totalPokemons = dados.count;
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

    this.scrollParaTopo();
  }

  async proximaPagina() {
    if (this.paginaAtual + 1 < this.totalPaginas) {
      this.paginaAtual++;
      await this.carregarPokemons();
    }
  }

  async paginaAnterior() {
    if (this.paginaAtual > 0) {
      this.paginaAtual--;
      await this.carregarPokemons();
    }
  }

  async mudarLimite() {
    this.paginaAtual = 0;
    await this.carregarPokemons();
  }

  scrollParaTopo() {
    if (this.conteudo) {
      this.conteudo.scrollToTop(200);
    }
  }

  get totalPaginas(): number {
    return Math.ceil(this.totalPokemons / this.limitePorPagina);
  }

  getPaginasVisiveis(): (number | string)[] {
    const paginas: (number | string)[] = [];
    const total = this.totalPaginas;
    const atual = this.paginaAtual + 1;

    if (total <= 7) {
      for (let i = 1; i <= total; i++) paginas.push(i);
    } else {
      paginas.push(1);

      if (atual > 4) paginas.push('...');

      const inicio = Math.max(2, atual - 1);
      const fim = Math.min(total - 1, atual + 1);
      for (let i = inicio; i <= fim; i++) paginas.push(i);

      if (atual < total - 3) paginas.push('...');

      paginas.push(total);
    }

    return paginas;
  }

  async irParaPagina(num: number) {
    this.paginaAtual = num - 1;
    await this.carregarPokemons();
  }
}
