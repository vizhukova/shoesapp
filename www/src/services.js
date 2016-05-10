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

             item.deptLevel = +item.deptLevel;
             item.id = +item.id;
             if(item.parentId) item.parentId = +item.parentId;
             if(item.deptLevel === 1) return item;

             //if(item.deptLevel === 1) {
             //  item.items = c.filter((it) => it.deptLevel === 2 && it.parentId === item.id);
             //  return item;
             //}
           });
           resolve(categories);
         })

      })
    }

    this.getAll = function (data) {

      data = data || {};
      var categories = [];

      return new Promise((resolve, reject) => {

         Common.get('section.filter', data).then((c) => {
           categories = c.filter((item) => {
             item.id = +item.id;
             if(item.parentId) item.parentId = +item.parentId;
              return item;
           });
           resolve(categories);
         })

      })
    }

    this.getArrayTree = function(category_id) {

      var categories = [];
      var tree = {};

      return new Promise((resolve, reject) => {

         this.getAll().then((c) => {

           categories = c;

          var cat = _.find(categories, {id: category_id});

          if(cat.parentId) {

             tree = getTree(cat.id, [cat]);

          } else {

            tree = cat;

          }

          var chieldCat = categories.filter((item) => item.parentId === cat.id);
          tree.items = chieldCat;
          resolve([tree]);

         });

      })

      function getTree(category_id, items) {
        var category = _.find(categories, {id: category_id});
        category.items = items;
        if(category.parentId) return getTree(category.parentId, [category]);
        else return category;
      }
    }

  })

  .service('Item', function ($http, $q, URL, Common, Server,  localStorageService) {

    var likes =  localStorageService.get('likedItems') || [];

    this.getFiltered = function (data) {

      data = data || {};

      return new Promise((resolve, reject) => {

        Common.get('item.filter', data).then((items) => {

          items.map((item) => {
            if(item) {
              item.id = + item.id;
              item.isLiked = likes.indexOf(item.id) > -1;
            }
          });

          resolve(items);

        })

      });

    };

    this.get = function (data) {

      data = data || {};

      return new Promise((resolve, reject) => {

         Common.get('item.get', data).then((item) => {
           if(item)  {
             item.id = + item.id;
             item.isLiked = !!likes.indexOf(item.id) > -1;
           }
           resolve(item);
         })

      })
    };

    this.addLiked = (id) => {

      likes.push(id);
      localStorageService.set('likedItems', likes);
       console.log('addLiked', likes)
      Server.post('item.love', {"brandId": id, "love": 1});

    };

    this.removeLiked = (id) => {

      likes = likes.filter((item) => item != id);
      localStorageService.set('likedItems', likes);
      Server.post('item.love', {"brandId": id, "love": 0});

    };

    this.getLiked = () => {

      return new Promise((resolve, reject) => {

        var products = [];

        this.getFiltered().then((p) => {

          products = p;

          Common.get('account.getLove').then((data) => {

              likes =  localStorageService.get('likedItems') || [];

              if(! data) {
                likes.concat( _.difference(likes, data) );
              }

              var likedProduct = products.filter((item) => likes.indexOf(item.id) > -1);

              resolve(likedProduct);
          })

        })

      });




  };

  })

  .service('Brand', function ($http, $q, localStorageService, URL, Common, Item, Server) {

    var self = this;
    var likes = localStorageService.get('likedBrands') || [];

    this.getFiltered =  (data) => {

      var brands = {};

      return new Promise((resolve, reject) => {

        Common.get('brand.filter', data).then((b) => {

          brands = b;

          Promise.map(brands, (brand, index) => {

            return Item.getFiltered({brandId: +brand.id}).then((products, i) => {

              brands[index].items = products;

              if(products[0]) {

                return Item.get({id: products[0].id}).then((product) => {

                  brands[index].items[0] = product;
                  brands[index].isLiked = likes.indexOf(brands[index].id) > -1;

                })

              }

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

            return Item.getFiltered({feature: 'sales', brandId: +brand.id}).then((products) => {

              brands[index].items = products;
              brands[index].sale = true;
              brands[index].title = 'Sale';
              brands[index].id = +brands[index].id;

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

            return Item.getFiltered({feature: 'new', brandId: +brand.id}).then((products) => {

              brands[index].items = products;
              brands[index].title = 'New Arrivals';
              brands[index].id = +brands[index].id;

            })

          }).then((result) => {

            resolve(brands);

          })

        })

      })

    };

    this.getPopular = (data) => {

      var brands = {};

      return new Promise((resolve, reject) => {

        Common.get('brand.filter', {feature: 'popular'}).then((b) => {

          brands = b;

          Promise.map(brands, (brand, index) => {

            return Item.getFiltered({feature: 'popular', brandId: +brand.id}).then((products) => {

              brands[index].items = products;
              brands[index].title = 'Popular';
              brands[index].id = +brands[index].id;

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


      return new Promise((resolve, reject) => {
         Common.get('brand.get', data).then((brand) => {

          if(brand) {
            brand.id = +brand.id;
            brand.isLiked = likes.indexOf(brand.id) > -1;
          }
           resolve(brand);

        })
      });
    };

    this.getBrandProducts = () => {

      return [];

    };

    this.getFullFiltered = (data) => {

      return new Promise((resolve, reject) => {

        var brands = [];

        this.getFiltered(data).then((data) => {

          Promise.map(data, (brand) => {

            return this.get({id: +brand.id}).then((fullBrand) => {
              brands.push(fullBrand);
            })

          }).then(() => {
            resolve(brands);
          })

        });

      });

    };

    this.addLiked = (id) => {

      likes.push(+id);
      localStorageService.set('likedBrands', likes);
       console.log('addLiked', likes)
      Server.post('brand.follow', {"brandId": +id, "follow": 1});

    };

    this.removeLiked = (id) => {

      likes = likes.filter((item) => item != +id);
      localStorageService.set('likedBrands', likes);
      Server.post('brand.follow', {"brandId": +id, "follow": 0});

    };

    this.getLiked = () => {

      return new Promise((resolve, reject) => {

        var brands = [];

        this.getFiltered().then((b) => {

          brands =  b;

          Common.get('account.getBrandFollow').then((data) => {

              likes =  localStorageService.get('likedBrands') || [];

              if(! data) {
                likes.concat( _.difference(likes, data) );
              }

              var likedBrands = brands.filter((item) => likes.indexOf(+item.id) > -1);

              resolve(likedBrands);
          })

        })

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

     console.log(URL + url)


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





