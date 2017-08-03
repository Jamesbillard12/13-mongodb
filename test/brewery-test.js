'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const Brewery = require('../model/brewery.js');
const PORT = process.env.PORT || 3000;
const mongoose = require('mongoose');



mongoose.Promise = Promise;
require('../server.js');

const url = `http://localhost:${PORT}`;

const exampleBrewery = {
  name: 'test brewery name',
  address: 'test address',
  phoneNumber: '555-555-5555',
};

describe('Brewery Routes', function() {
  describe('POST: /api/brewery', function() {
    describe('with a valid req body', function() {
      after( done => {
        if(this.tempBrewery) {
          Brewery.remove({})
          .then( () => done())
          .catch(done);
          return;
        }
        done();
      });

      it('should return a brewery', done => {
        request.post(`${url}/api/brewery`)
        .send(exampleBrewery)
        .end((err,res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal('test brewery name');
          expect(res.body.address).to.equal('test address');
          expect(res.body.phoneNumber).to.equal('555-555-5555');
          this.tempBrewery = res.body;
          done();
        });
      });
    });
    describe('with an invalid request', function() {
      it('should return 400', done => {
        request.post(`${url}/api/brewery`)
        .send()
        .end((err,res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });
  });
  describe('GET: /api/brewery/:id', function() {
    describe('with a valid body', function() {
      before( done => {
        exampleBrewery.timestamp = new Date();
        new Brewery(exampleBrewery).save()
        .then( brewery => {
          this.tempBrewery = brewery;
          done();
        })
        .catch(done);
      });

      after( done => {
        delete exampleBrewery.timestamp;
        if (this.tempBrewery) {
          Brewery.remove({})
          .then( () => done())
          .catch(done);
          return;
        }
        done();
      });

      it('should return a brewery', done => {
        request.get(`${url}/api/brewery/${this.tempBrewery._id}`)
        .end( (err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal('test brewery name');
          expect(res.body.address).to.equal('test address');
          expect(res.body.phoneNumber).to.equal('555-555-5555');
          done();
        });
      });
    });
    describe('with an invalid request', function(){
      it('should return 404', done => {
        request.get(`${url}/api/brewery/1231231231241413212`)
        .end( (err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
  });
});
