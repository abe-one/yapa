import {
  SET_KEYDOWN,
  fSTART,
  fSUCCESS,
  fFAILURE,
  fCOMPLETE,
  URL_POKEMON,
  PKMN,
  PREV_URL_POKEMON,
  NEXT_URL_POKEMON,
} from "../actions";

const initialState = {
  isLoading: false,
  error: "",
  pendingCalls: [],
  urlPokemon: [],
  prevUrlPokemon: [],
  nextUrlPokemon: [],
  pokemonList: [],
  pagination: {
    totPokemonCount: 0,
    nextCall: null,
    prevCall: null,
    currentCall: {
      callCount: 0,
      prevCount: 0,
      nextCount: 0,
    },
  },
  userKeyDown: null,
};

const parseCall = (totCount, count, prev, next) => {
  let prevCount;
  let nextCount;
  const url = prev ? prev : next;
  const splitUrl = url.split("=");
  if (prev) {
    prevCount = parseInt(splitUrl[2]) + parseInt(splitUrl[1]);
    nextCount = totCount - (prevCount + parseInt(splitUrl[2]));
  } else {
    nextCount = totCount - parseInt(splitUrl[2]);
    prevCount = 0;
  }

  return {
    callCount: count,
    prevCount: prevCount,
    nextCount: nextCount,
  };
};

export const reducer = (state = initialState, action) => {
  const payload = action.payload;
  switch (action.type) {
    case SET_KEYDOWN:
      return {
        ...state,
        userKeyDown: payload,
      };

    case fSTART(URL_POKEMON):
      return {
        ...state,
        isLoading: true,
        userKeyDown: null,
      };

    case fSUCCESS(URL_POKEMON):
      const { results, count, next, previous } = payload;
      return {
        ...state,
        urlPokemon: results,
        pagination: {
          ...state.pagination,
          totPokemonCount: count,
          nextCall: next,
          prevCall: previous,
          currentCall: parseCall(count, results.length, previous, next),
        },
      };

    case fFAILURE(URL_POKEMON):
      return {
        ...state,
        error: payload,
      };

    case fCOMPLETE(URL_POKEMON):
      return {
        ...state,
        isLoading: false,
      };

    // case fSTART(PKMN):
    //   return {
    //     ...state,
    //     isLoading: true,
    //   };

    case fSUCCESS(PKMN):
      return {
        ...state,
        pokemonList: [...state.pokemonList, payload].sort(
          (a, b) => a.id - b.id
        ),
      };

    // case fFAILURE(PKMN):
    //   return {
    //     ...state,
    //     error: payload,
    //   };

    // case fCOMPLETE(PKMN):
    //   return {
    //     ...state,
    //     isLoading: false,
    //   };

    case fSUCCESS(NEXT_URL_POKEMON):
      return {
        ...state,
        nextUrlPokemon: payload.results,
      };

    case fSUCCESS(PREV_URL_POKEMON):
      return {
        ...state,
        prevUrlPokemon: payload.results,
      };

    default:
      return state;
  }
};
