import express from 'express';
import { auth } from '../middleware/auth.js';
import { getAllPokemons, getPokemonById, createPokemon, updatePokemon, deletePokemon } from '../controllers/pokemons.js';

const router = express.Router();
router.get("/pokemons", getAllPokemons);
router.get("/pokemons/:id", getPokemonById);
router.post("/pokemons", auth, createPokemon);
router.put("/pokemons/:id", auth, updatePokemon);
router.delete("/pokemons/:id", auth, deletePokemon);
export default router;