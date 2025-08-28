import { Injectable } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class TratamentosService {
  private carregar: HTMLIonLoadingElement | null = null;

  constructor(
    private controladorLoading: LoadingController,
    private controladorToast: ToastController
  ) {}

  async mostrarLoading(mensagem = 'Carregando...') {
    this.carregar = await this.controladorLoading.create({
      message: mensagem,
      spinner: 'bubbles',
      cssClass: 'carregar',
    });

    setTimeout(() => {
      this.carregar?.present();
    }, 50);
  }

  async esconderCarregando() {
    if (this.carregar) {
      await this.carregar.dismiss();
      this.carregar = null;
    }
  }

  async mostrarErro(mensagem: string = 'Ocorreu um erro :(') {
    const toast = await this.controladorToast.create({
      message: mensagem,
      duration: 3000,
      color: 'danger',
      position: 'bottom',
    });
    toast.present();
  }

  async mostrarAvisoPesquisa(
    mensagem: string = 'Nenhum Pokémon encontrado! :/'
  ) {
    const toast = await this.controladorToast.create({
      message: mensagem,
      duration: 2500,
      color: 'medium',
      position: 'top',
    });
    toast.present();
  }
}
