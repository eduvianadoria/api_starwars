import * as mongoose from 'mongoose'

export interface PlanetInterface extends mongoose.Document {
    name: string,
    climate: string,
    terrain: string,
    apparitionsInFilms: number
}

const planetSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true
    },
    climate: {
        type: String
    },
    terrain: {
        type: String
    },
    apparitionsInFilms: {
        type: Number
    }
},
{
    collection: 'planet'
})

export const Planet = mongoose.model<PlanetInterface>('Planet', planetSchema)