import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonIcon, IonSpinner } from '@ionic/angular/standalone';
import { CabecalhoComponent } from 'src/app/componentes/cabecalho/cabecalho.component';
import { ActivatedRoute } from '@angular/router';
import { PokemonService } from 'src/app/services/pokemon.service';
import { FavoritosService } from 'src/app/services/favoritos.service';
import { TratamentosService } from 'src/app/tratamento-erros/tratamentos.service';

@Component({
  selector: 'app-detalhes',
  templateUrl: './detalhes.page.html',
  styleUrls: ['./detalhes.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonIcon,
    IonSpinner,
    CommonModule,
    FormsModule,
    CabecalhoComponent,
  ],
})
export class DetalhesPage implements OnInit {
  pokemon: any = {
    peso: 0,
    altura: 0,
    masculino: 0,
    feminino: 0,
    tipos: [],
    nome: '',
    id: 0,
    imagem: '',
  };
  habilidades: string[] = [];
  fraquezas: string[] = [];
  resistencias: string[] = [];
  imunidades: string[] = [];
  movimentos: any[] = [];
  mostrarMovimentos = false;

  movimentosPorPagina = 10;
  paginaAtual = 1;
  totalPaginas = 1;
  favorito = false;

  carregando = false; // flag para spinner

  constructor(
    private route: ActivatedRoute,
    private pokemonService: PokemonService,
    private favoritosService: FavoritosService,
    private tratamentoErro: TratamentosService
  ) {}

  coresTipo: any = {
    normal: '#d8d7b0',
    fighting: '#f19b96',
    flying: '#e7b8ff',
    poison: '#caa0d1',
    ground: '#f2d79b',
    rock: '#d3c175',
    bug: '#bce789',
    ghost: '#b59ed0',
    steel: '#c3d1db',
    fire: '#f5a078',
    water: '#7fb3f5',
    grass: '#a8e69b',
    electric: '#f2f58d',
    psychic: '#f5a0ce',
    ice: '#a4dbe1',
    dragon: '#9c8ef5',
    dark: '#b8a78b',
    fairy: '#f5b4d9',
  };

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.carregando = true;
      try {
        await this.carregarPokemon(+id);
      } catch (e) {
        this.tratamentoErro.mostrarErro('Erro ao carregar os Pokémon.');
      } finally {
        this.carregando = false;
      }
    }
  }

  alternarMovimentos() {
    this.mostrarMovimentos = !this.mostrarMovimentos;
  }

  get movimentosPaginaAtual(): any[] {
    const start = (this.paginaAtual - 1) * this.movimentosPorPagina;
    const end = start + this.movimentosPorPagina;
    return this.movimentos.slice(start, end);
  }

  irParaProximaPagina() {
    if (this.paginaAtual < this.totalPaginas) this.paginaAtual++;
  }

  irParaPaginaAnterior() {
    if (this.paginaAtual > 1) this.paginaAtual--;
  }

  async carregarPokemon(id: number) {
    this.pokemon = await this.pokemonService.buscarPokemonPorId(id);

    this.habilidades =
      this.pokemon.habilidades?.map((h: any) => h.ability.name) || [];
    this.fraquezas = this.pokemon.fraquezas || [];
    this.resistencias = this.pokemon.resistencias || [];
    this.imunidades =
      this.pokemon.imunidades?.length > 0 ? this.pokemon.imunidades : ['-'];
    this.movimentos = this.pokemon.moves || [];

    this.totalPaginas = Math.ceil(
      this.movimentos.length / this.movimentosPorPagina
    );
    this.paginaAtual = 1;

    this.favorito = this.favoritosService.eFavorito(this.pokemon.id);
  }

  alternarFavorito() {
    this.favoritosService.alterarFavorito(this.pokemon);
    this.favorito = !this.favorito;
  }
}
