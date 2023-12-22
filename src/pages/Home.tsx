import React, { ChangeEvent } from "react";
import {
  Container,
  Grid,
  InputAdornment,
  TextField,
  Typography,
  Box,
  Button,
  IconButton,
  CircularProgress,
  Backdrop,
} from "@mui/material";
import PokemonCard from "../components/PokemonCard";
import {
  Field,
  usePokemonContext,
} from "../components/Contexts/PokemonProvider";
import { Search, FavoriteBorder, Favorite, Close } from "@mui/icons-material";
import PokemonFilterTypes from "../components/PokemonFilterTypes";

const Home: React.FC = () => {
  const {
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
    selectedTypes,
    setSelectedTypes,
    isLoading,
  } = usePokemonContext();

  function handleQueryChange(event: ChangeEvent<HTMLInputElement>) {
    search(event.target.value);
  }

  const handleToggleFavourites = () => {
    if (filters[Field.favourite]) {
      removeFilter(Field.favourite);
    } else {
      addFilter(Field.favourite, true);
    }
  };

  const pokemonsRender = () => {
    if (!pokemon.length && !isLoading) {
      return (
        <Box
          component="h1"
          sx={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            pt: 6,
          }}
        >
          No Pokemons Found
        </Box>
      );
    } else
      return (
        <Grid container spacing={2}>
          {pokemon.map((pokemon) => (
            <Grid item xs={12} sm={6} md={4} key={pokemon.name}>
              <PokemonCard
                pokemon={pokemon}
                isFavourite={favourites.includes(pokemon.name)}
                onAddFavourite={() => addFavourite(pokemon)}
                onRemoveFavourite={() => removeFavourite(pokemon)}
              />
            </Grid>
          ))}
        </Grid>
      );
  };

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Backdrop
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, color: "#fff" }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Typography variant="h1">
        What Pokemon <br />
        are you looking for?
      </Typography>
      <Box
        sx={{
          display: "flex",
          pt: 4,
          pb: 2,
        }}
      >
        <TextField
          id="pokemon-search"
          placeholder="Search Pokemon"
          variant="outlined"
          value={query}
          onChange={handleQueryChange}
          InputProps={{
            sx: { pr: 0 },
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => search("")}>
                  <Close />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Button
          startIcon={
            filters[Field.favourite] ? <Favorite /> : <FavoriteBorder />
          }
          color={filters[Field.favourite] ? "primary" : "secondary"}
          sx={{
            flexShrink: 0,
            ml: "2rem",
          }}
          onClick={handleToggleFavourites}
        >
          My Favourites ({favourites.length})
        </Button>
      </Box>
      <Box
        sx={{
          display: "flex",
          pb: 4,
        }}
      >
        <PokemonFilterTypes
          addFilterType={(type: any) => {
            setSelectedTypes([...selectedTypes, type]);
          }}
          allTypes={types}
          removeFilterType={(type: any) => {
            setSelectedTypes(
              selectedTypes.filter((selectedType) => selectedType !== type)
            );
          }}
          selectedTypes={selectedTypes}
        />
      </Box>

      <Grid container spacing={2}>
        {pokemonsRender()}
      </Grid>
    </Container>
  );
};

export default Home;
