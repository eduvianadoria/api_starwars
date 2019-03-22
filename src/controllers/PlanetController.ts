import { Request, Response } from "express";
import * as HttpStatus from 'http-status';

import PlanetService from "../services/PlanetService";

export class PlanetController {

    private planetService;

    constructor() {
        this.planetService = PlanetService;
    }

    public list = (req: Request, res: Response, next) => {
        if (!req.query.name && !req.query.id) {
            return this.findAll(req, res, next)
        } else if (req.query.name) {
            return this.findByName(req, res, next)
        } else {
            return this.findById(req, res, next)
        }
    }

    public findById = (req: Request, res: Response, next) => {

        this.planetService.findById(req.query.id)
            .then(planet => {
                if (!planet) {
                    res.status(HttpStatus.NOT_FOUND).send('ID do planeta não localizado')
                    return next()
                }
                res.status(HttpStatus.OK).json(planet)
                return next()
            })
            .catch(error => {
                console.log(error);
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Erro na consulta do planeta por ID.')
                return next()
            })
    }

    private findByName = (req: Request, res: Response, next) => {

        this.planetService.findByName(req.query.name)
            .then(planets => {
                res.status(HttpStatus.OK).json(planets)
                return next()
            })
            .catch(error => {
                console.log(error)
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Erro na consulta de planetas por nome.')
                return next()
            })
    }

    private findAll = (req: Request, res: Response, next) => {

        this.planetService.findAll()
            .then(planets => {
                if (planets == null) {
                    res.status(HttpStatus.NOT_FOUND).send('Planeta não foi encontrado.')
                    return next()
                }
                res.status(HttpStatus.OK).json(planets)
                return next()
            })
            .catch(error => {
                console.log(error)
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Erro ao listar os planetas.')
                return next()
            })
    }

    public add = (req: Request, res: Response, next) => {

        if (!req.body.name || !req.body.climate || !req.body.terrain) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Campos obrigatórios não informado.')
            return next()
        }

        let planet = {
            name: req.body.name,
            climate: req.body.climate,
            terrain: req.body.terrain,
            apparitionsInFilms: null
        }

        this.planetService.findPlanetInSwapi(planet.name)
            .then(_planet => {

                if (planet.climate != _planet.climate) {
                    throw new Error("O clima do planeta informado não confere com a informação obtida da API SWAPI")
                }
                //TODO: Validar com o "cliente" se precisa validar as informações do terreno na API SWAPI!
                planet.apparitionsInFilms = _planet.apparitionsInFilms
                return this.planetService.save(planet)
            })
            .then(_planet => {
                res.status(HttpStatus.CREATED).json(_planet)
                return next()
            })
            .catch(erro => {
                let message = "Ocorreu um erro ao salvar o planeta!"
                if (erro.message) {
                    message = erro.message
                }
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(message)
                return next()
            });
    }

    public remove = (req: Request, res: Response, next) => {

        this.planetService.remove(req.params.id)
            .then(_ => {
                res.status(HttpStatus.OK).send('O planeta foi removido com sucesso.')
                return next()
            })
            .catch(error => {
                let message = "Ocorreu um erro ao remover o planeta!"
                if (error.message) {
                    message = error.message
                }
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(message)
                return next()
            })

    }



}

