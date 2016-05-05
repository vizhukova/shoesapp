import Promise from 'bluebird';
import _ from 'lodash';
import moment from 'moment';

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
      var categories = [];

      return new Promise((resolve, reject) => {

         Common.get('section.filter', data).then((c) => {
           categories = c.filter((item) => {
             if(item.deptLevel === 0) {
               item.items = c.filter((it) => it.deptLevel === 1 && it.parentId === item.id);
               return item;
             }
           });

           resolve(categories);
         })

      })
    }

    this.getArrayTree = function(category_id) {

      var categories = [];
      var arr = [];

      return new Promise((resolve, reject) => {

         Common.get('section.filter', {}).then((c) => {

           categories = c;

          var cat = _.find(categories, {id: category_id});

          if(cat.parentId) {

             arr = getTree(cat.id, []);

          } else {

            arr.push([cat]);

          }

          var chieldCat = categories.filter((item) => item.parentId === cat.id);
          arr.push(chieldCat);
          resolve(arr);

         });

      })

      function getTree(category_id, arr) {
        var category = _.find(categories, {id: category_id});
        arr.unshift([category]);
        if(category.parentId) return getTree(category.parentId, arr);
        else return arr;
      }
    }

  })

  .service('Item', function ($http, $q, URL, Common, Server,  localStorageService) {

    var likes = [];

    this.getFiltered = function (data) {

      data = data || {};

      return new Promise((resolve, reject) => {

        Common.get('item.filter', data).then((items) => {

          items.map((item) => {

            item.isLiked = likes.filter((id) => item.id === id).length > 0;

          });

          resolve(items);

        })

      });

    };

    this.get = function (data) {

      data = data || {};

      return new Promise((resolve, reject) => {

         Common.get('item.get', data).then((item) => {
           if(item) item.isLiked = likes.filter((id) => item.id === id).length > 0;
           resolve(item);
         })

      })
    };

    this.like = function(data) {

      data.love = 1;

      return Server.post('item.love', data).then(() => {

        likes.push(data.id);
        localStorageService.set('likedItems', likes);

      });

    };

    this.dislike = function(data) {

      data.love = 0;

      return Server.post('item.love', data).then(() => {

        likes = likes.filter((item) => item != data.id);
        localStorageService.set('likedItems', likes);

      })

    };



  })

  .service('Brand', function ($http, $q, localStorageService, URL, Common, Item) {

    var self = this;

    this.getFiltered =  (data) => {

      var brands = {};

      return new Promise((resolve, reject) => {

        Common.get('brand.filter', data).then((b) => {

          brands = b;

          Promise.map(brands, (brand, index) => {

            return Item.getFiltered({brandId: brand.id}).then((products, i) => {

              brands[index].items = products;

              return Item.get({id: products[0].id}).then((product) => {

                brands[index].items[0] = product;

              })

            })

          }).then(() => {

            resolve(brands);

          })

        })

      })
    };

    this.getSales = (data) => {

      var brands = {};

      return new Promise((resolve, reject) => {

        Common.get('brand.filter', {feature: 'sales'}).then((b) => {

          brands = b;

          Promise.map(brands, (brand, index) => {

            return Item.getFiltered({feature: 'sales', brandId: brand.id}).then((products) => {

              brands[index].items = products;
              brands[index].sale = true;
              brands[index].title = 'Sale';

            })

          }).then((result) => {

            resolve(brands);

          })

        })

      })

    };

    this.getNewArrivals = (data) => {

      var brands = {};

      return new Promise((resolve, reject) => {

        Common.get('brand.filter', {feature: 'new'}).then((b) => {

          brands = b;

          Promise.map(brands, (brand, index) => {

            return Item.getFiltered({feature: 'new', brandId: brand.id}).then((products) => {

              brands[index].items = products;
              brands[index].title = 'New Arrivals';

            })

          }).then((result) => {

            resolve(brands);

          })

        })

      })

    };

    this.getItems = (data) => {

      var brand = {};

      return new Promise((resolve, reject) => {

        Common.get('brand.get', data.brandFilter).then((b) => {

          brand = b;

            return Item.getFiltered(data.itemFilter).then((products, i) => {

              brand.items = products;


          }).then(() => {

            resolve(brand);

          })

        })

      })

    };

    this.get = (data) => {

      return Common.get('brand.get', data);

    };

    this.getBrandProducts = () => {

      return [];

    };

    this.getFullFiltered = (data) => {

      return new Promise((resolve, reject) => {

        var brands = [];

        this.getFiltered(data).then((data) => {

          Promise.map(data, (brand) => {

            return this.get({id: brand.id}).then((fullBrand) => {
              brands.push(fullBrand);
            })

          }).then(() => {
            resolve(brands);
          })

        });

      });

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

  .service('Alert', function ($http, $q, URL, Common) {

    this.get = function (data) {

      data = data || {};

      return Common.get('alert.filter', data);
    }

  })

  .service('Size', function ($http, $q, URL, Common) {

    this.get = function (data) {

      data = data || {};

      return Common.get('item.getSize', data);
    }

  })

  .service('Address', function ($http, $q, URL, Common, Server) {

    this.get = (data) => {

      data = data || {};

      return Common.get('item.getSize', data);
    };

    this.add = (data) => {

      data = data || {};

      return Server.post('account.addAddress', data);
    };

    this.update = (data) => {

      data = data || {};

      return Server.post('account.updateAddress', data);
    }

  })

  .service('Location', function ($http, $q, URL, Common) {

    this.getbyZip = function (data) {

      data = data || {};

      return Common.get('shop.getLocationByZip', data);
    };

    this.getbyName = function (data) {

      data = data || {};

      return Common.get('shop.getLocationByName', data);
    };

  })

  .service('Cache', function () {

    var cache = {};

    this.get = (key) => {

      var dataToReturn = cache[key];
      if(dataToReturn) {

        var today = moment();

        if(moment.max(today, dataToReturn.endTime) == today) {

          return undefined;

        } else {
          return dataToReturn.data;

        }
      } else {

        return undefined;

      }

    };

    this.set = (key, data) => {

      cache[key] = {
        data: data.result,
        endTime: moment().add(data.ttl, 's')
      }
    };

  })

  .service('Server', function ($http, $q, URL) {

    this.fetch = (url) => {

      return new Promise((resolve, reject) => {

        $http({
          method: 'GET',
          url: URL + url
        }).then((response) => {
          resolve(response.data);

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
          resolve(response.data);

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

        Object.keys(data).map((key, index) => {

          url += `${index === 0 ? '/?' : '&'}${key}=${data[key]}`;

        });

        var items = Cache.get(url);

        if (!items) {

          Server.fetch(url).then((data) => {
            Cache.set(url, data);
            resolve(data.result);
          });

        } else {
          resolve(items);
        }

      })
    };
  });





