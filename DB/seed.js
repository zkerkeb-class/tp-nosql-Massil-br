import 'dotenv/config';
import mongoose from 'mongoose';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { connectDB } from './connect.js';
import Pokemon from '../models/pokemon.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataPath = join(__dirname, '..', 'data', 'pokemons.json');

async function seed() {
    await connectDB();
    const raw = readFileSync(dataPath, 'utf-8');
    const pokemons = JSON.parse(raw);
    const toInsert = pokemons.map(({ id, name, type, base }) => ({ id, name, type, base }));

    await Pokemon.deleteMany({});
    console.log('Collection vidée.');

    const result = await Pokemon.insertMany(toInsert);
    console.log(`${result.length} Pokémon insérés avec succès !`);

    await mongoose.connection.close();
    console.log('Connexion fermée.');
}

seed().catch((err) => {
    console.error(err);
    process.exit(1);
});
