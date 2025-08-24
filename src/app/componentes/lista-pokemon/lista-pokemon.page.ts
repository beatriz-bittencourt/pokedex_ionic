import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonSelect,
  IonSelectOption,
} from '@ionic/angular/standalone';
import { FichaPokemonPage } from '../ficha-pokemon/ficha-pokemon.page';
import { PokemonService } from '../../services/pokemon.service';
import { Router, NavigationEnd } from '@angular/router';
import { FavoritosService } from '../../services/favoritos.service';

@Component({
  selector: 'app-lista-pokemon',
  templateUrl: './lista-pokemon.page.html',
  styleUrls: ['./lista-pokemon.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FichaPokemonPage,
    IonSelect,
    IonSelectOption,
  ],
})
export class ListaPokemonPage implements OnInit {
  pokemons: any[] = [];
  paginaAtual = 0;
  limitePorPagina = 15;
  totalPokemons = 0;

  opcoesLimite: number[] = [5, 10, 15, 20, 50];
  ordenacao: string = 'crescente';
  opcoesOrdenacao = [
    { valor: 'crescente', label: 'Numérica Crescente' },
    { valor: 'decrescente', label: 'Numérica Decrescente' },
    { valor: 'alfabetica-asc', label: 'A-Z' },
    { valor: 'alfabetica-desc', label: 'Z-A' },
  ];

  private _procuraTexto = '';
  get procuraTexto(): string {
    return this._procuraTexto;
  }
  set procuraTexto(value: string) {
    this._procuraTexto = value;
    this.paginaAtual = 0;
    this.atualizarListaProcessada();
    this.scrollParaTopo();
  }

  @ViewChild(IonContent) conteudo!: IonContent;

  private _listaProcessada: any[] = [];

  constructor(
    private pokemonService: PokemonService,
    private favoritosService: FavoritosService,
    private router: Router
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.carregarTodosPokemons();
      }
    });
  }

  async ngOnInit() {
    await this.carregarTodosPokemons();
  }

  ionViewWillEnter() {
    this.carregarTodosPokemons();
  }

  async carregarTodosPokemons() {
    const todos = await this.pokemonService.buscarTodos();

    this.pokemons = todos.map((p) => ({
      ...p,
      favorito: this.favoritosService.eFavorito
        ? this.favoritosService.eFavorito(p.id)
        : false,
    }));

    this.paginaAtual = 0;
    this.atualizarListaProcessada();
    this.scrollParaTopo();
  }

  atualizarListaProcessada() {
    let lista = [...this.pokemons];
    if (this.procuraTexto) {
      lista = lista.filter((p) =>
        p.nome.toLowerCase().includes(this.procuraTexto.toLowerCase())
      );
    }

    switch (this.ordenacao) {
      case 'alfabetica-asc':
        lista.sort((a, b) => a.nome.localeCompare(b.nome));
        break;
      case 'alfabetica-desc':
        lista.sort((a, b) => b.nome.localeCompare(a.nome));
        break;
      case 'decrescente':
        lista.sort((a, b) => b.id - a.id);
        break;
      case 'crescente':
      default:
        lista.sort((a, b) => a.id - b.id);
        break;
    }

    this._listaProcessada = lista;
    this.totalPokemons = this._listaProcessada.length;

    if (this.paginaAtual > this.totalPaginas - 1) {
      this.paginaAtual = Math.max(0, this.totalPaginas - 1);
    }
  }

  scrollParaTopo() {
    if (this.conteudo) this.conteudo.scrollToTop(200);
  }

  favoritar(pokemon: any) {
    this.favoritosService.alterarFavorito(pokemon);
    if (this.favoritosService.eFavorito) {
      pokemon.favorito = this.favoritosService.eFavorito(pokemon.id);
    } else {
      const favs = JSON.parse(
        localStorage.getItem('favoritos') || '[]'
      ) as any[];
      pokemon.favorito = favs.some((p) => p.id === pokemon.id);
    }
  }

  get pokemonsFiltrados() {
    if (!this.procuraTexto) return this.pokemons;
    return this.pokemons.filter((p) =>
      p.nome.toLowerCase().includes(this.procuraTexto.toLowerCase())
    );
  }

  get pokemonsOrdenados() {
    let arr = [...this.pokemonsFiltrados];
    switch (this.ordenacao) {
      case 'alfabetica-asc':
        arr.sort((a, b) => a.nome.localeCompare(b.nome));
        break;
      case 'alfabetica-desc':
        arr.sort((a, b) => b.nome.localeCompare(a.nome));
        break;
      case 'decrescente':
        arr.sort((a, b) => b.id - a.id);
        break;
      case 'crescente':
      default:
        arr.sort((a, b) => a.id - b.id);
        break;
    }
    return arr;
  }

  get totalPaginas(): number {
    const limite = Number(this.limitePorPagina) || 1;
    return Math.max(1, Math.ceil((this._listaProcessada.length || 0) / limite));
  }

  get pokemonsPaginaAtual() {
    const limite = Number(this.limitePorPagina) || 1;
    const inicio = this.paginaAtual * limite;
    return this._listaProcessada.slice(inicio, inicio + limite);
  }

  proximaPagina() {
    if (this.paginaAtual + 1 < this.totalPaginas) {
      this.paginaAtual++;
      this.scrollParaTopo();
    }
  }

  paginaAnterior() {
    if (this.paginaAtual > 0) {
      this.paginaAtual--;
      this.scrollParaTopo();
    }
  }

  mudarLimite() {
    this.limitePorPagina = Number(this.limitePorPagina) || 15;
    this.paginaAtual = 0;
    this.atualizarListaProcessada();
    this.scrollParaTopo();
  }

  irParaPagina(num: number) {
    this.paginaAtual = num - 1;
    this.scrollParaTopo();
  }

  quandoMudarOrdenacao() {
    this.paginaAtual = 0;
    this.atualizarListaProcessada();
    this.scrollParaTopo();
  }
  get intervaloExibicao(): string {
    const inicio =
      this.totalPokemons === 0
        ? 0
        : this.paginaAtual * this.limitePorPagina + 1;
    const fim = Math.min(
      (this.paginaAtual + 1) * this.limitePorPagina,
      this.totalPokemons
    );
    return `${inicio}-${fim} de ${this.totalPokemons}`;
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
}
