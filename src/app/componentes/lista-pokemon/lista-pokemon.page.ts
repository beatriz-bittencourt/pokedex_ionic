import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonSelect,
  IonSelectOption,
  IonSpinner,
} from '@ionic/angular/standalone';
import { FichaPokemonPage } from '../ficha-pokemon/ficha-pokemon.page';
import { PokemonService } from '../../services/pokemon.service';
import { Router, NavigationEnd } from '@angular/router';
import { FavoritosService } from '../../services/favoritos.service';
import { TratamentosService } from 'src/app/tratamento-erros/tratamentos.service';

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
    IonSpinner,
  ],
})
export class ListaPokemonPage implements OnInit {
  todosPokemons: any[] = [];
  pokemons: any[] = [];

  paginaAtual = 0;
  limitePorPagina = 15;
  totalPokemons = 0;

  private readonly TOTAL_FIXO = 1025;

  loading: boolean = false;

  opcoesLimite: number[] = [5, 10, 15, 20, 50];
  ordenacao:
    | 'crescente'
    | 'decrescente'
    | 'alfabetica-asc'
    | 'alfabetica-desc' = 'crescente';
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
    this.carregarPaginaAtual();
    this.scrollParaTopo();
  }

  @ViewChild(IonContent) conteudo!: IonContent;

  constructor(
    private pokemonService: PokemonService,
    private favoritosService: FavoritosService,
    private router: Router,
    private tratamentoErro: TratamentosService
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.carregarPaginaAtual();
      }
    });
  }

  async ngOnInit() {
    try {
      await this.carregarPaginaAtual();
    } catch (e) {
      this.tratamentoErro.mostrarErro('Erro ao carregar Pokémon :(');
    }
  }

  async carregarPaginaAtual() {
    try {
      this.loading = true;

      if (this.procuraTexto.trim().length > 0) {
        await this.garantirTodosCarregados();
        const termo = this.procuraTexto.toLowerCase();
        let lista = this.todosPokemons.filter((p) =>
          p.nome.toLowerCase().includes(termo)
        );

        lista = this.ordenarListaCompleta(lista);

        this.totalPokemons = lista.length;

        const inicio = this.paginaAtual * this.limitePorPagina;
        this.pokemons = lista.slice(inicio, inicio + this.limitePorPagina);
        this.marcarFavoritosNaPagina();
        return;
      }

      if (this.ordenacao === 'crescente') {
        const offset = this.paginaAtual * this.limitePorPagina;
        let limite = this.limitePorPagina;

        if (offset + limite > this.TOTAL_FIXO) {
          limite = this.TOTAL_FIXO - offset;
        }

        const pagina = await this.pokemonService.buscarTodos(limite, offset);
        this.pokemons = pagina.map((p: any) => ({
          ...p,
          favorito: this.favoritosService.eFavorito
            ? this.favoritosService.eFavorito(p.id)
            : false,
        }));

        this.totalPokemons = this.TOTAL_FIXO;
        return;
      }
      if (this.ordenacao === 'decrescente') {
        const total = this.TOTAL_FIXO;

        const endExclusive = total - this.paginaAtual * this.limitePorPagina;
        const offset = Math.max(0, endExclusive - this.limitePorPagina);
        const pageSize = endExclusive - offset;

        const pagina = await this.pokemonService.buscarTodos(pageSize, offset);

        this.pokemons = pagina
          .map((p: any) => ({
            ...p,
            favorito: this.favoritosService.eFavorito
              ? this.favoritosService.eFavorito(p.id)
              : false,
          }))
          .reverse();

        this.totalPokemons = total;
        return;
      }

      if (
        this.ordenacao === 'alfabetica-asc' ||
        this.ordenacao === 'alfabetica-desc'
      ) {
        await this.garantirTodosCarregados();

        let lista = [...this.todosPokemons];
        lista = this.ordenarListaCompleta(lista);

        this.totalPokemons = lista.length;

        const inicio = this.paginaAtual * this.limitePorPagina;
        this.pokemons = lista.slice(inicio, inicio + this.limitePorPagina);
        this.marcarFavoritosNaPagina();
        return;
      }
    } catch (e) {
      this.tratamentoErro.mostrarErro('Erro ao carregar Pokémon :(');
    } finally {
      this.loading = false;
      this.scrollParaTopo();
    }
  }

  private ordenarListaCompleta(lista: any[]): any[] {
    switch (this.ordenacao) {
      case 'alfabetica-asc':
        return lista.sort((a, b) => a.nome.localeCompare(b.nome));
      case 'alfabetica-desc':
        return lista.sort((a, b) => b.nome.localeCompare(a.nome));
      case 'decrescente':
        return lista.sort((a, b) => b.id - a.id);
      case 'crescente':
      default:
        return lista.sort((a, b) => a.id - b.id);
    }
  }

  private async garantirTodosCarregados() {
    if (this.todosPokemons.length > 0) return;
    const todos = await this.pokemonService.buscarTodos(this.TOTAL_FIXO, 0);
    this.todosPokemons = todos.map((p: any) => ({
      ...p,
      favorito: this.favoritosService.eFavorito
        ? this.favoritosService.eFavorito(p.id)
        : false,
    }));
  }

  private marcarFavoritosNaPagina() {
    this.pokemons = this.pokemons.map((p) => ({
      ...p,
      favorito: this.favoritosService.eFavorito
        ? this.favoritosService.eFavorito(p.id)
        : false,
    }));
  }

  limparPesquisa() {
    this.procuraTexto = '';
    this.paginaAtual = 0;
    this.carregarPaginaAtual();
  }

  abrirDetalhes(id: number) {
    this.router.navigate(['/detalhes', id]);
  }

  scrollParaTopo() {
    if (this.conteudo) this.conteudo.scrollToTop(200);
  }

  favoritar(pokemon: any) {
    this.favoritosService.alterarFavorito(pokemon);
    pokemon.favorito = this.favoritosService.eFavorito
      ? this.favoritosService.eFavorito(pokemon.id)
      : false;

    const idx = this.todosPokemons.findIndex((p) => p.id === pokemon.id);
    if (idx > -1) {
      this.todosPokemons[idx] = {
        ...this.todosPokemons[idx],
        favorito: pokemon.favorito,
      };
    }
  }

  proximaPagina() {
    if (this.paginaAtual + 1 < this.totalPaginas) {
      this.paginaAtual++;
      this.carregarPaginaAtual();
    }
  }

  paginaAnterior() {
    if (this.paginaAtual > 0) {
      this.paginaAtual--;
      this.carregarPaginaAtual();
    }
  }

  mudarLimite() {
    this.paginaAtual = 0;
    this.limitePorPagina = Number(this.limitePorPagina) || 15;
    this.carregarPaginaAtual();
  }

  get totalPaginas(): number {
    return Math.max(1, Math.ceil(this.totalPokemons / this.limitePorPagina));
  }

  irParaPagina(num: number) {
    this.paginaAtual = num - 1;
    this.carregarPaginaAtual();
  }

  quandoMudarOrdenacao() {
    this.paginaAtual = 0;
    this.carregarPaginaAtual();
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
}
