import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private baseUrl = 'https://pokeapi.co/api/v2/pokemon';

  constructor() {}

  async buscarTodos(limit = 1025, offset = 0): Promise<any[]> {
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

  async buscarPokemonPorId(id: number): Promise<any> {
    const resposta = await fetch(`${this.baseUrl}/${id}`);
    const dados = await resposta.json();

    const speciesResponse = await fetch(
      `https://pokeapi.co/api/v2/pokemon-species/${id}`
    );
    const species = await speciesResponse.json();

    const genderRate = species.gender_rate;
    let masculino = 0;
    let feminino = 0;

    if (genderRate !== -1) {
      feminino = (genderRate / 8) * 100;
      masculino = 100 - feminino;
    }

    const mapeamentoDanos: any = {};
    for (const t of dados.types) {
      const typeResp = await fetch(
        `https://pokeapi.co/api/v2/type/${t.type.name}`
      );
      const typeData = await typeResp.json();
      typeData.damage_relations.double_damage_from.forEach((d: any) => {
        mapeamentoDanos[d.name] = (mapeamentoDanos[d.name] || 1) * 2;
      });
      typeData.damage_relations.half_damage_from.forEach((d: any) => {
        mapeamentoDanos[d.name] = (mapeamentoDanos[d.name] || 1) * 0.5;
      });
      typeData.damage_relations.no_damage_from.forEach((d: any) => {
        mapeamentoDanos[d.name] = 0;
      });
    }

    const fraquezas: string[] = [];
    const resistencias: string[] = [];
    const imunidades: string[] = [];
    Object.keys(mapeamentoDanos).forEach((tipo) => {
      const val = mapeamentoDanos[tipo];
      if (val === 0) imunidades.push(tipo);
      else if (val < 1) resistencias.push(tipo);
      else if (val > 1) fraquezas.push(tipo);
    });

    const movimentos = dados.moves.map((m: any, idx: number) => ({
      id: idx + 1,
      nome: m.move.name,
      move_learn_method:
        m.version_group_details[0]?.move_learn_method?.name || '-',
    }));

    return {
      id: dados.id,
      nome: dados.name,
      imagem: dados.sprites.other['official-artwork'].front_default,
      tipos: dados.types.map((t: any) => t.type.name),
      peso: dados.weight / 10,
      altura: dados.height / 10,
      masculino,
      feminino,
      habilidades: dados.abilities,
      fraquezas,
      resistencias,
      imunidades: imunidades.length > 0 ? imunidades : ['-'],
      moves: movimentos,
    };
  }
}
