import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private baseUrl = 'https://pokeapi.co/api/v2/pokemon';

  constructor() {}

  async buscarTodos(limit = 100000, offset = 0): Promise<any[]> {
    const resposta = await fetch(
      `${this.baseUrl}?limit=${limit}&offset=${offset}`
    );
    const dados = await resposta.json();

    const pokemons = await Promise.all(
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

    return pokemons;
  }
}
