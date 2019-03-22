import * as mocha from 'mocha';
import * as Chai from 'chai';
const supertest = require('supertest');
import App from '../../../src/Api';

Chai.use(require('chai-things'))
const app  = App;
const request = supertest;
const expect = Chai.expect;
const should = Chai.should();

export { app, expect, should, request, mocha }