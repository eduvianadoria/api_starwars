import { Planet, PlanetInterface } from '../models/Planet'
import * as HttpStatus from 'http-status'
let axios = require('axios')

class PlanetService {

    constructor() { }

    public remove(id: number): Promise<PlanetInterface> {

        return new Promise((resolve, reject) => {
            Planet.findByIdAndRemove(id, (error, planet) => {
                if (error) {
                    return reject(new Error('Não foi possível encontrar o ID do planeta para remover'))
                }
                resolve()
            })
            .catch(error => {
                reject(error)
            })
        })
    }

    public findById(id: string): Promise<PlanetInterface> {

        return new Promise((resolve, reject) => {
            Planet.findById(id, (error, planet) => {
                if (error) {
                    return resolve(null)
                }
                resolve(planet)
            })
            .catch(error => {
                reject(error)
            })
        })
    }

    public findByName(name: string): Promise<PlanetInterface[]> {

        return new Promise((resolve, reject) => {
            let filterName = {$regex: name, $options: 'i'};
            Planet.find({name: filterName}, (error, planets) => {
                if (error) {
                    return resolve([])
                }
                resolve(planets)
            })
            .catch(error => {
                reject(error)
            })
        })
    }

    public findAll(): Promise<PlanetInterface[]> {

        return new Promise((resolve, reject) => {
            Planet.find()
                .then(planets => {
                    if (!planets || planets.length == 0) {
                        resolve(null)
                    } else {
                        resolve(planets)
                    }
                })
                .catch(error => {
                    reject(error)
                })
        })
    }

    public save(doc: object) {

        return new Promise((resolve, reject) => {
            let planet = new Planet(doc)
            planet.save()
                .then(_planet => {
                    if (!_planet) {
                        throw new Error('Ocorreu um erro ao salvar o planeta na base de dados!')
                    }
                    resolve(_planet)
                })
                .catch(error => {
                    reject(error)
                })
        })
    }

    public findPlanetInSwapi(name: string): Promise<object> {

        return new Promise((resolve, reject) => {
            let options = {
                method: 'get',
                url: `http://swapi.co/api/planets?search=${name}`,
                headers: { "content-type": "application/json" }
            }
            axios(options)
                .then(res => {
                    if (res.status == HttpStatus.OK) {

                        let data = res.data

                        if (data.count == 0) {
                            reject(new Error(`O planeta "${name}" não foi encontrado na API SWAPI!`))
                        } else if (data.count > 1) {
                            reject(new Error(`Muitos planetas foram encontrados na API SWAPI com o nome "${name}" informado!`))
                        } else {
                            let result = data.results[0]

                            let planet = {
                                name: result.name,
                                climate: result.climate,
                                terrain: result.terrain,
                                apparitionsInFilms: result.films.length
                            };

                            resolve(planet)
                        }
                    } else {
                        reject(new Error("Ocorreu um erro ao validar o planeta na api SWAPI!"))
                    }
                })
                .catch(error => {
                    reject(error)
                })
        })
    }
}

export default new PlanetService();