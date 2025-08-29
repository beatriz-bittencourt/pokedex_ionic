import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonIcon, IonSpinner } from '@ionic/angular/standalone';
import { CabecalhoComponent } from 'src/app/componentes/cabecalho/cabecalho.component';
import { ActivatedRoute } from '@angular/router';
import { PokemonService } from 'src/app/services/pokemon.service';
import { FavoritosService } from 'src/app/services/favoritos.service';
import { TratamentosService } from 'src/app/tratamento-erros/tratamentos.service';
import { NavController } from '@ionic/angular';

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

  indiceOrdenacao: 'padrao' | 'crescente' | 'decrescente' = 'padrao';
  nomeOrdenacao: 'padrao' | 'crescente' | 'decrescente' = 'padrao';
  metodoOrdenacao: 'padrao' | 'crescente' | 'decrescente' = 'padrao';

  constructor(
    private route: ActivatedRoute,
    private pokemonService: PokemonService,
    private favoritosService: FavoritosService,
    private tratamentoErro: TratamentosService,
    private navCtrl: NavController
  ) {}

  coresTipo: any = {
    normal: '#d8d7b0',
    fighting: '#f19b96',
    flying: '#8fa8f9',
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

  voltar() {
    this.navCtrl.back();
  }

  mostrarShiny = false;

  alternarShiny() {
    this.mostrarShiny = !this.mostrarShiny;
  }

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.carregando = true;
      try {
        await this.carregarPokemon(+id);
      } catch (e) {
        this.tratamentoErro.mostrarErro('Erro ao carregar :(');
      } finally {
        this.carregando = false;
      }
    }
  }

  alternarMovimentos() {
    this.mostrarMovimentos = !this.mostrarMovimentos;
  }

  alternarOrdenacaoIndice() {
    this.nomeOrdenacao = 'padrao';
    this.metodoOrdenacao = 'padrao';

    switch (this.indiceOrdenacao) {
      case 'padrao':
        this.indiceOrdenacao = 'crescente';
        break;
      case 'crescente':
        this.indiceOrdenacao = 'decrescente';
        break;
      case 'decrescente':
        this.indiceOrdenacao = 'padrao';
        break;
    }

    this.paginaAtual = 1;
  }

  alternarOrdenacaoNome() {
    this.indiceOrdenacao = 'padrao';
    this.metodoOrdenacao = 'padrao';
    switch (this.nomeOrdenacao) {
      case 'padrao':
        this.nomeOrdenacao = 'crescente';
        break;
      case 'crescente':
        this.nomeOrdenacao = 'decrescente';
        break;
      case 'decrescente':
        this.nomeOrdenacao = 'padrao';
        break;
    }
    this.paginaAtual = 1;
  }

  alternarOrdenacaoMetodo() {
    this.indiceOrdenacao = 'padrao';
    this.nomeOrdenacao = 'padrao';
    switch (this.metodoOrdenacao) {
      case 'padrao':
        this.metodoOrdenacao = 'crescente';
        break;
      case 'crescente':
        this.metodoOrdenacao = 'decrescente';
        break;
      case 'decrescente':
        this.metodoOrdenacao = 'padrao';
        break;
    }
    this.paginaAtual = 1;
  }

  get movimentosPaginaAtual(): any[] {
    let lista: any[] = [...this.movimentos];

    if (this.indiceOrdenacao === 'crescente')
      lista.sort((a, b) => a.indiceOriginal - b.indiceOriginal);
    else if (this.indiceOrdenacao === 'decrescente')
      lista.sort((a, b) => b.indiceOriginal - a.indiceOriginal);

    if (this.nomeOrdenacao === 'crescente')
      lista.sort((a, b) => a.nome.localeCompare(b.nome));
    else if (this.nomeOrdenacao === 'decrescente')
      lista.sort((a, b) => b.nome.localeCompare(a.nome));

    if (this.metodoOrdenacao === 'crescente')
      lista.sort((a, b) =>
        a.move_learn_method.localeCompare(b.move_learn_method)
      );
    else if (this.metodoOrdenacao === 'decrescente')
      lista.sort((a, b) =>
        b.move_learn_method.localeCompare(a.move_learn_method)
      );

    const start = (this.paginaAtual - 1) * this.movimentosPorPagina;
    const end = start + this.movimentosPorPagina;
    return lista.slice(start, end);
  }

  getIndiceReal(i: number): number {
    return this.movimentosPaginaAtual[i].indiceOriginal;
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

    this.movimentos =
      this.pokemon.moves?.map((mov: any, i: number) => ({
        ...mov,
        indiceOriginal: i + 1,
      })) || [];

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

  carregando = false;
}
