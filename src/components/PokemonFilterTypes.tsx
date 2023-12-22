import { Box, Stack, Button } from "@mui/material"
import { PokemonType } from "./Contexts/PokemonProvider"
import React from "react"
import PokemonTypeIcon from "./PokemonTypeIcon"
import { INamedApiResource, IType } from "pokeapi-typescript"

interface PokemonFilterTypesProps {
  allTypes: INamedApiResource<IType>[]
  selectedTypes: PokemonType[]
  addFilterType: (type: PokemonType) => void
  removeFilterType: (type: PokemonType) => void
}


const PokemonFilterTypes: React.FC<PokemonFilterTypesProps> = ({
  allTypes,
  selectedTypes,
  addFilterType,
  removeFilterType
}) => {

  const isMaxSelected = selectedTypes.length >= 2;

  function handleToggleType(type: PokemonType) {
    if (selectedTypes.includes(type)) {
      removeFilterType(type)
    } else {
        if (!isMaxSelected) {
        addFilterType(type);
      }
    }
  }

  const types: PokemonType[] = allTypes.map(type => type.name) as PokemonType[]

  return (
    <Box
      sx={{
        pt: 4,
        pb: 2
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        flexWrap={"wrap"}
        gap={2}
      >
        {types.map((type) => (
          <Button
            key={type}
            startIcon={<PokemonTypeIcon type={type} />}
            color={selectedTypes.includes(type) ? "primary": "secondary"}
            onClick={() => handleToggleType(type)}
            disabled={isMaxSelected && !selectedTypes.includes(type)}
          >
            {type}
          </Button>
        ))}
      </Stack>
    </Box>
  )
}

export default PokemonFilterTypes