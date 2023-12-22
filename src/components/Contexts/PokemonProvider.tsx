import React, { useContext, useEffect, useState } from "react";
import PokeAPI, {
  INamedApiResource,
  IPokemon,
  IType,
} from "pokeapi-typescript";
import { arraysHaveSameElements, getIdFromUrl } from "../../utils";

export enum Field {
  favourite = "favourite",
}

type Filters = { [key in Field]: FilterValue };
type FilterValue = boolean | string | string[] | undefined;

interface PokemonContextData {
  pokemon: INamedApiResource<IPokemon>[];
  query: string;
  search: (query: string) => void;
  favourites: string[];
  addFavourite: (pokemon: INamedApiResource<IPokemon>) => void;
  removeFavourite: (pokemon: INamedApiResource<IPokemon>) => void;
  filters: Filters;
  addFilter: (field: Field, value: FilterValue) => void;
  removeFilter: (field: Field) => void;
  types: INamedApiResource<IType>[];
  setTypes: (types: INamedApiResource<IType>[]) => void;
  selectedTypes: PokemonType[];
  setSelectedTypes: (types: PokemonType[]) => void;
  isLoading: boolean
}

export const PokemonContext = React.createContext<
  PokemonContextData | undefined
>(undefined);

interface PokemonProviderProps {
  children: React.ReactNode;
}

interface IPokemonWithTypes extends INamedApiResource<IPokemon> {
  types: PokemonType[];
}

export enum PokemonType {
  bug = "bug",
  dark = "dark",
  dragon = "dragon",
  electric = "electric",
  fairy = "fairy",
  fighting = "fighting",
  fire = "fire",
  flying = "flying",
  ghost = "ghost",
  grass = "grass",
  ground = "ground",
  ice = "ice",
  normal = "normal",
  poison = "poison",
  psychic = "psychic",
  rock = "rock",
  steel = "steel",
  water = "water",
}

export enum PokemonStat {
  hp = "hp",
  attack = "attack",
  defense = "defense",
  specialAttack = "special-attack",
  specialDefense = "special-defense",
  speed = "speed",
}

const PokemonProvider: React.FC<PokemonProviderProps> = ({ children }) => {
  const [data, setData] = useState<INamedApiResource<IPokemon>[]>([]);
  const [pokemon, setPokemon] = useState<INamedApiResource<IPokemon>[]>([]);
  const [types, setTypes] = useState<INamedApiResource<IType>[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<PokemonType[]>([]);
  const [favourites, setFavourites] = useState<string[]>([]);
  const [query, setQuery] = useState<string>("");
  const [filters, setFilters] = useState<Filters>({} as Filters);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>();

  useEffect(() => {
    if (!!selectedTypes.length) {
      fetchPokemonByType();
    } else {
      setPokemon(data);
    }
  }, [selectedTypes]);

  useEffect(() => {
    fetchPokemonTypeList();
    fetchPokemon();
  }, []);

  useEffect(() => {
    if (filters[Field.favourite] === undefined) {
      return;
    }

    filterData();
  }, [filters[Field.favourite]]);

  useEffect(() => {
    filterData();
  }, [filters, query, data]);

  const filterData = async () => {
    if (!data) {
      return;
    }

    let filteredData = [...data];
    const fields = Object.keys(filters) as Field[];

    for (const field of fields) {
      switch (field) {
        case Field.favourite: {
          const value = filters[field];
          if (value) {
            filteredData = filteredData.filter((pokemon) =>
              favourites.includes(pokemon.name)
            );
          } else if (value === false) {
            filteredData = filteredData.filter(
              (pokemon) => !favourites.includes(pokemon.name)
            );
          }
          break;
        }
      }
    }

    if (query) {
      filteredData = filteredData.filter((pokemon) =>
        pokemon.name.includes(query)
      );
    }

    filteredData.sort((a, b) => {
      const aId = getIdFromUrl(a.url);
      const bId = getIdFromUrl(b.url);

      if (aId > bId) {
        return 1;
      } else {
        return -1;
      }
    });

    setPokemon(filteredData);
  };

  const fetchPokemonTypeList = async () => {
    try {
      const response = await PokeAPI.Type.listAll();
      setTypes(response.results);
    } catch (error) {
      setError(error);
    }
  };

  const fetchPokemonByType = async () => {
    setIsLoading(true);
    try {
      let pokemonList: IPokemonWithTypes[] = [];

      for (const type of selectedTypes) {
        const response = await PokeAPI.Type.resolve(type);
        if (response.pokemon) {
          response.pokemon.forEach((p) => {
            const existingPokemon = pokemonList.find(
              (pokemon) => pokemon.name === p.pokemon.name
            );

            if (existingPokemon) {
              if (!existingPokemon.types.includes(type)) {
                existingPokemon.types.push(type);
              }
            } else {
              pokemonList.push({
                name: p.pokemon.name,
                url: p.pokemon.url,
                types: [type],
              });
            }
          });
        }
      }

      const filteredPokemonList = pokemonList.filter((pokemon) =>
        arraysHaveSameElements(pokemon.types, selectedTypes)
      );

      setPokemon(filteredPokemonList);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPokemon = async () => {
    try {
      const response = await PokeAPI.Pokemon.list(150, 0);
      setData(response.results);
      setPokemon(response.results);
    } catch (error) {
      setError(error);
    }
  };

  const search = (query: string) => {
    setQuery(query);
  };

  function addFavourite(pokemon: INamedApiResource<IPokemon>) {
    setFavourites([...favourites, pokemon.name]);
  }

  function removeFavourite(pokemon: INamedApiResource<IPokemon>) {
    setFavourites(favourites.filter((favourite) => favourite !== pokemon.name));
  }

  function addFilter(field: Field, value: FilterValue) {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
  }

  function removeFilter(field: Field) {
    const newFilters = { ...filters };
    newFilters[field] = undefined;
    setFilters(newFilters);
  }

  if (error) {
    return <div>Error</div>;
  }

  if (!pokemon.length && !types.length) {
    return <div></div>;
  }

  return (
    <PokemonContext.Provider
      value={{
        pokemon,
        query,
        search,
        favourites,
        addFavourite,
        removeFavourite,
        filters,
        addFilter,
        removeFilter,
        types,
        setTypes,
        selectedTypes,
        setSelectedTypes,
        isLoading
      }}
    >
      {children}
    </PokemonContext.Provider>
  );
};

export const usePokemonContext = () => {
  const pokemon = useContext(PokemonContext);

  if (!pokemon) {
    throw Error("Cannot use `usePokemonContext` outside of `PokemonProvider`");
  }

  return pokemon;
};

export default PokemonProvider;
