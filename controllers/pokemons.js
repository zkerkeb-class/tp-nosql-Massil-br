import Pokemon from '../models/pokemon.js';

export async function getAllPokemons(req, res) {
    try {
        const { type, name, sort, page = 1, limit = 50 } = req.query;
        const filter = {};
        if (type) filter.type = type;
        if (name) filter['name.english'] = { $regex: name, $options: 'i' };

        const total = await Pokemon.countDocuments(filter);
        const pageNum = Math.max(1, parseInt(page, 10) || 1);
        const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 50));
        const skip = (pageNum - 1) * limitNum;

        let query = Pokemon.find(filter);
        if (sort) query = query.sort(sort);
        const data = await query.skip(skip).limit(limitNum);

        res.status(200).json({
            data,
            page: pageNum,
            limit: limitNum,
            total,
            totalPages: Math.ceil(total / limitNum)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


export async function getPokemonById(req, res) {
    try {
        const { id } = req.params;
        const pokemon = await Pokemon.findOne({ id: Number(id) });
        if (!pokemon) return res.status(404).json({ message: 'Pokémon introuvable' });
        res.status(200).json(pokemon);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


export async function createPokemon(req, res) {
    try {
        const { id, name, type, base } = req.body;
        const pokemon = await Pokemon.create({ id, name, type, base });
        res.status(201).json(pokemon);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


export async function updatePokemon(req, res) {
    try {
        const { id } = req.params;
        const { name, type, base } = req.body;
        const pokemon = await Pokemon.findOneAndUpdate({ id: Number(id) }, { name, type, base }, { new: true });
        if (!pokemon) return res.status(404).json({ message: 'Pokémon introuvable' });
        res.status(200).json(pokemon);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function deletePokemon(req, res) {
    try {
        const { id } = req.params;
        const pokemon = await Pokemon.findOneAndDelete({ id: Number(id) });
        if (!pokemon) return res.status(404).json({ message: 'Pokémon introuvable' });
        res.status(200).json({ message: 'Pokémon supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}