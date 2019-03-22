import { Planet } from '../../src/models/Planet'
import * as HttpStatus from 'http-status';
import { app, request, expect, should } from './config/helpers';
import db from '../../src/Db'
const config = require('../../src/config/env/config')();

let planetaCadastroMock
let planetMock

before(done => {
    db.connect()
    .then(() => {
        planetaCadastroMock = {
            id: null,
            name: "Hoth",
            climate: "frozen",
            terrain: "tundra, ice caves, mountain ranges"
        }

        planetMock = {
            id: null,
            name: "Dagobah",
            climate: "frozen",
            terrain: "ice caves",
            apparitionsInFilms: 3
        }

        let planet = new Planet(planetMock)
        planet.save()
        .then(planet => {
            if(!planet) throw new Error('Erro ao criar o planeta para relizar o teste de remoção.') 
            planetMock.id = planet._id
            done()
        })
        .catch(error => {
            console.log(error)            
        })
      
    })
    .catch(error=> {
        console.error(`Erro ao conectar o MongoDB: ${error}`);
    })
    
})

after(done => {
    Planet.findByIdAndRemove(planetMock.id, (error, planet) => {
        if(error)
            throw new Error(`Erro ao remover planetMock após execução dos testes. ${error}`)
        done()  
    })
    .catch(error => {
        throw error
    })
})

describe('Teste de Integração da API', ()=>{
    
    describe('Obter Planetas', ()=>{
        
        it('Busca um planeta por Id: Deve retornar um planeta que contém dados informados (status 200).', () => {
            
           return request(app)
            .get(`/planetas?id=${planetMock.id}`)
            .set('Content-Type', 'application/json')
            .expect(HttpStatus.OK)            
            .then(res => {
                expect(res.status).to.equal(HttpStatus.OK)
                expect(res.body.name).to.equal(planetMock.name)
                expect(res.body.climate).to.equal(planetMock.climate)
                expect(res.body.terrain).to.equal(planetMock.terrain)  
            })
            .catch(erro => {
                throw erro
            })
            
        })

        it('Filtra planetas por nome: Deve retornar um planeta que contém o nome informado (status 200).', () => {
            
            return request(app)
             .get(`/planetas?name=${planetMock.name}`)
             .set('Content-Type', 'application/json')
             .expect(HttpStatus.OK)            
             .then(res => {
                 expect(res.status).to.equal(HttpStatus.OK)
                 expect(res.body[0].name).to.equal(planetMock.name)
                 expect(res.body[0].climate).to.equal(planetMock.climate)
                 expect(res.body[0].terrain).to.equal(planetMock.terrain)  
             })
             .catch(erro => {
                 throw erro
             })
             
         })
       
         it('Lista todos os planetas cadastrados: Deve retornar um array de planeta(s) (status 200).', done => {

            request(app)
            .get('/planetas')
            .set('Content-Type', 'application/json')
            .end((err, res) => {
                expect(res.status).to.equal(HttpStatus.OK)
                res.body.should.be.a("array")
                res.body.should.all.have.property('name')
                res.body.should.all.have.property('climate')
                res.body.should.all.have.property('terrain')
                res.body.should.all.have.property('apparitionsInFilms')
                done()
            })
            
         })

    })

    describe('Cadastrar um Planeta', ()=>{

        it('Cadastra um planeta: Deve cadastrar um planeta e retornar os mesmos dados (status 201)' , done => {
            request(app)
            .post('/planeta')
            .set('Content-Type', 'application/json')
            .send(planetaCadastroMock)                
            .end((err, res) => {
                if(err) done(err);
                if(res.body.status) expect(HttpStatus.OK).to.equal(res.body.status)
                expect(planetaCadastroMock.name).to.equal(res.body.name)
                expect(planetaCadastroMock.climate).to.equal(res.body.climate)
                expect(planetaCadastroMock.terrain).to.equal(res.body.terrain)
                planetaCadastroMock.id = res.body._id
                done();
            });
        })
    
    })

    describe('Remover o Planeta', ()=>{ 

        it('Remove um planeta: Deve remover o planeta que foi cadastrado anteriormente (status 200)' , done => {
            request(app)
            .delete(`/planeta/${planetaCadastroMock.id}`)
            .end((err, res) => {
                if(err)
                    done(err);
                if(res.body.status)   
                    expect(HttpStatus.OK).to.equal(res.body.status)
                done();
            })
        })

    })

})