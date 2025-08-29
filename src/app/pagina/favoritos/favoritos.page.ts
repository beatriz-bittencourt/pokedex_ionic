import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { CabecalhoComponent } from 'src/app/componentes/cabecalho/cabecalho.component';
import { FichaPokemonPage } from '../../componentes/ficha-pokemon/ficha-pokemon.page';
import { FavoritosService } from '../../services/favoritos.service';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.page.html',
  styleUrls: ['./favoritos.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    CommonModule,
    FormsModule,
    CabecalhoComponent,
    FichaPokemonPage,
  ],
})
export class FavoritosPage implements OnInit {
  todosFavoritos: any[] = [];
  favoritos: any[] = [];

  paginaAtual = 0;
  limitePorPagina = 10;

  @ViewChild(IonContent) conteudo!: IonContent;

  constructor(
    private favoritosService: FavoritosService,
    private router: Router,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.favoritosService.favoritos$.subscribe((lista) => {
      this.todosFavoritos = lista.map((pokemon) => ({
        ...pokemon,
        favorito: this.favoritosService.eFavorito(pokemon.id),
      }));
      this.atualizarLista();
    });
  }

  atualizarLista() {
    const inicio = this.paginaAtual * this.limitePorPagina;
    this.favoritos = this.todosFavoritos.slice(
      inicio,
      inicio + this.limitePorPagina
    );
  }

  proximaPagina() {
    if (this.paginaAtual + 1 < this.totalPaginas) {
      this.paginaAtual++;
      this.atualizarLista();
      this.scrollParaTopo();
    }
  }

  paginaAnterior() {
    if (this.paginaAtual > 0) {
      this.paginaAtual--;
      this.atualizarLista();
      this.scrollParaTopo();
    }
  }

  irParaPagina(num: number) {
    this.paginaAtual = num - 1;
    this.atualizarLista();
    this.scrollParaTopo();
  }

  get totalPaginas(): number {
    return Math.max(
      1,
      Math.ceil(this.todosFavoritos.length / this.limitePorPagina)
    );
  }

  get intervaloExibicao(): string {
    const inicio =
      this.todosFavoritos.length === 0
        ? 0
        : this.paginaAtual * this.limitePorPagina + 1;
    const fim = Math.min(
      (this.paginaAtual + 1) * this.limitePorPagina,
      this.todosFavoritos.length
    );
    return `${inicio}-${fim} de ${this.todosFavoritos.length}`;
  }

  favoritar(pokemon: any) {
    this.favoritosService.alterarFavorito(pokemon);
  }

  abrirDetalhes(id: number) {
    this.router.navigate(['/detalhes', id]);
  }

  voltarHome() {
    this.navCtrl.navigateRoot('/home');
  }

  scrollParaTopo() {
    if (this.conteudo) this.conteudo.scrollToTop(200);
  }
}
