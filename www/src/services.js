import Promise from 'bluebird';
import _ from 'lodash';

angular.module('starter.services', [])

    .service('User', function (Server) {
  /*
  curl --data "{"email":"test@test.ru","pass":"asdfsfd","firstName":"Ivan"}"  http://shoes.mikero.ru/api/auth.signUp --header "Content-Type:application/json"
  */
    this.signIn = function(data) {
      return Server.post('auth.signIn', data);
    };

    this.signUp = function(data) {
      return Server.post('auth.signUp', data);
    };

    this.forgotPassword = function(data) {
      return Server.post('auth.forgotPassword', data);
    };

  })

  .service('Category', function (Common) {


    this.get = function (data) {

      data = data || {};

      return Common.get('section.filter', data);
    }
  })

  .service('Brand', function ($http, $q, localStorageService, URL, Common) {

    this.getFiltered = function (data) {

      return Common.get('brand.filter', data);
    };

    this.get = function (data) {

      return Common.get('brand.get', data);

    };

    this.getBrandProducts = function () {

      return [];

    };

    this.saveInLocalStorage = (chosenBrands) => {

      localStorageService.set('chosenBrands', chosenBrands);

    };

  })

  .service('Settings', function ($http, localStorageService) {

    var settings = {

      sexObj: {
        sex: ['Women', 'Men', 'Both'],
        chosenIndex: 0
      },

      faq: 'test text faq',
      shippingAndReturns: 'test text shippingAndReturns',
      privacyPolicy: 'test text privacyPolicy',
      termsOfService: 'test text termsOfService'
    };

    this.saveInLocalStorage = function () {

      localStorageService.set('Settings', settings);

    };

    this.get = function () {

      return settings;
    };

    this.getSexObj = function () {

      return settings.sexObj;

    };

    this.setCurrenctSexIndex = function (index) {

      settings.sexObj.chosenIndex = index;
      this.saveInLocalStorage();

    };

    this.saveInLocalStorage();
  })

  .service('Content', function ($http, $q, URL, Common) {

    this.get = function (data) {

      data = data || {};

      return Common.get('item.filter', data);
    }

  })

  .service('Cache', function () {

    var cache = {};

    this.get = (key) => {
      return cache[key];
    };
    this.set = (key, data) => {
      cache[key] = data;
    };

  })

  .service('Server', function ($http, $q, URL) {

    this.fetch = (url) => {

      return new Promise((resolve, reject) => {

        $http({
          method: 'GET',
          url: URL + url
        }).then((response) => {
          resolve(response.data.result);

        }, (error) => {
          console.warn('error', error);
          reject(error);
        });

      })
    };

    this.post = (url, data) => {

      return new Promise((resolve, reject) => {

        $http({
          method: 'POST',
          url: URL + url,
          data: JSON.stringify(data)
        }).then((response) => {
          resolve(response.data.result);

        }, (error) => {
          console.warn('error', error);
          reject(error);
        });

      })
    };

  })

  .service('Common', function ($http, $q, Cache, Server) {

    this.get = function (url, data) {

      return new Promise((resolve, reject) => {

        data = data || {};

        if (data.id) {
          url += '/id=' + data.id;
          data = _.omit(data, ['id']);
        }
        if (data.feature) {

          if (Object.keys(data).length > 1 ) {

            url += '&feature=' + data.feature;

          } else {

            url += '/?feature=' + data.feature;

          }

        }

        var items = Cache.get(url);

        if (!items) {

          var promise = Server.fetch(url);

          promise.then((data) => {
            Cache.set(url, data);
          });

          resolve(promise);

        } else {
          resolve(items);
        }

      })
    };
  });



