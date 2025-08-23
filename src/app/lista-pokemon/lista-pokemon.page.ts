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
import { PokemonService } from '../services/pokemon.service';

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

  private _procuraTexto = '';
  get procuraTexto(): string {
    return this._procuraTexto;
  }
  set procuraTexto(value: string) {
    this._procuraTexto = value;
    this.paginaAtual = 0;
    this.scrollParaTopo();
  }

  @ViewChild(IonContent) conteudo!: IonContent;
  constructor(private pokemonService: PokemonService) {}

  async ngOnInit() {
    await this.carregarTodosPokemons();
  }

  scrollParaTopo() {
    if (this.conteudo) {
      this.conteudo.scrollToTop(200);
    }
  }

  async carregarTodosPokemons() {
    this.pokemons = await this.pokemonService.buscarTodos();
    this.totalPokemons = this.pokemons.length;
    this.scrollParaTopo();
  }

  async proximaPagina() {
    if (this.paginaAtual + 1 < this.totalPaginas) {
      this.paginaAtual++;
      this.scrollParaTopo();
    }
  }

  async paginaAnterior() {
    if (this.paginaAtual > 0) {
      this.paginaAtual--;
      this.scrollParaTopo();
    }
  }

  async mudarLimite() {
    this.limitePorPagina = Number(this.limitePorPagina);
    this.paginaAtual = 0;
    this.scrollParaTopo();
  }

  get totalPaginas(): number {
    return Math.ceil(this.pokemonsFiltrados.length / this.limitePorPagina);
  }

  get pokemonsFiltrados() {
    if (!this.procuraTexto) return this.pokemons;
    return this.pokemons.filter((p) =>
      p.nome.toLowerCase().includes(this.procuraTexto.toLowerCase())
    );
  }
  async irParaPagina(num: number) {
    this.paginaAtual = num - 1;
    this.scrollParaTopo();
  }

  getPaginasVisiveis(): (number | string)[] {
    const paginas: (number | string)[] = [];
    const total = this.totalPaginas;
    const atual = this.paginaAtual + 1;

    if (total <= 7) {
      for (let i = 1; i <= total; i++) paginas.push(i);
    } else {
      if (atual <= 3) {
        paginas.push(1, 2, 3, 4, '...', total);
      } else if (atual >= total - 2) {
        paginas.push(1, '...', total - 3, total - 2, total - 1, total);
      } else {
        paginas.push(1, '...', atual - 1, atual, atual + 1, '...', total);
      }
    }
    return paginas;
  }
  ordenacao: string = 'crescente';
  opcoesOrdenacao = [
    { valor: 'alfabetica-asc', label: 'Alfabética Nominal A-Z' },
    { valor: 'alfabetica-desc', label: 'Alfabética Nominal Z-A' },
    { valor: 'crescente', label: 'Numérica Crescente' },
    { valor: 'decrescente', label: 'Numérica Decrescente' },
  ];

  get pokemonsOrdenados() {
    let pokemons = [...this.pokemonsFiltrados];
    switch (this.ordenacao) {
      case 'alfabetica-asc':
        pokemons.sort((a, b) => a.nome.localeCompare(b.nome));
        break;
      case 'alfabetica-desc':
        pokemons.sort((a, b) => b.nome.localeCompare(a.nome));
        break;
      case 'decrescente':
        pokemons.sort((a, b) => b.id - a.id);
        break;
      case 'crescente':
      default:
        pokemons.sort((a, b) => a.id - b.id);
        break;
    }
    return pokemons;
  }

  get pokemonsPaginaAtual() {
    const inicio = this.paginaAtual * this.limitePorPagina;
    return this.pokemonsOrdenados.slice(inicio, inicio + this.limitePorPagina);
  }
}
