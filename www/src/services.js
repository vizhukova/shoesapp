import Promise from 'bluebird';
import _ from 'lodash';
import moment from 'moment';

angular.module('starter.services', [])

  .service('User', function (Server, localStorageService) {
  /*
  curl --data "{"email":"test@test.ru","pass":"asdfsfd","firstName":"Ivan"}"  http://shoes.mikero.ru/api/auth.signUp --header "Content-Type:application/json"
  */
    this.signIn = function(data) {
      //return Server.post('auth.signIn', data);

      return new Promise((resolve, reject) => {

        Server.post('auth.signIn', data).then((result) => {

          if(result.err_code) {

            reject(result.message)

          } else {

            localStorageService.set('token', result.token);
            resolve();
            console.log(result.token)

          }

        })

      })

    };

    this.signUp = function(data) {

      return new Promise((resolve, reject) => {

        Server.post('auth.signUp', data).then((result) => {

          if(result.err_code) {

            reject(result.message)

          } else {

            localStorageService.set('token', result.token);
            resolve();
            console.log('token', result.token)
          }

        })

      })

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

             if(item.deptLevel === '1') return item;

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

           categories = _.cloneDeep(c);
           var cat = _.find(categories, {id: category_id});


          var chieldCat = categories.filter((item) => item.parentId === cat.id);

           if(! chieldCat.length) {
             resolve(undefined);
             return;
           }

          if(cat.parentId) {

             tree = getTree(cat.id, [cat]);

          } else {

            tree = cat;

          }

          tree.items = chieldCat;
          resolve([tree]);

         });

      })
    }

    this.closeNode = function(siblingNodeId) {

      var tree = {};
      var categories = [];

      return new Promise((resolve, reject) => {

         this.getAll().then((c) => {

         categories = _.cloneDeep(c);

          var cat = _.find(categories, {id: siblingNodeId});

          if(cat.parentId) {

             tree = getTree(cat.id, [cat]);

          } else {

            tree = categories.filter((item) => {
              if( item.deptLevel === '1' ) {
                item.items = [];
                return item;
              }
            });

          }

          resolve(tree);

         });

      })
    };

    function getTree(category_id, items) {
        var category = _.find(categories, {id: category_id});
        category.items = items;
        if(category.parentId) return getTree(category.parentId, [category]);
        else return category;
      }

  })

  .service('Item', function ($http, $q, URL, Common, Server,  localStorageService) {

    var likes =  localStorageService.get('likedItems') || [];

    this.getFiltered = function (data) {

      data = data || {};

      return new Promise((resolve, reject) => {

        Common.get('item.filter', data).then((items) => {

          items = items || [];

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

  .service('Brand', function ($http, $q, localStorageService, URL, Common, Item, Category, Server) {

    var self = this;
    var likes = localStorageService.get('likedBrands') || [];

    this.getFiltered =  (data) => {

      var brands = {};

      return new Promise((resolve, reject) => {

        Common.get('brand.filter', data).then((b) => {

          brands = b;

          Promise.map(brands, (brand, index) => {

            return Item.getFiltered({brandId: brand.id}).then((products, i) => {

              brands[index].items = products;

              return Category.get({brandId: brand.id}).then((data) => {

                brands[index].categories = data;

              }).then(() => {

                if (products[0]) {

                  return Item.get({id: products[0].id}).then((product) => {

                    brands[index].items[0] = product;
                    brands[index].isLiked = likes.indexOf(brands[index].id) > -1;

                  })
                }

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
              brands[index].id = brands[index].id;

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

            return Item.getFiltered({feature: 'popular', brandId: brand.id}).then((products) => {

              brands[index].items = products;
              brands[index].title = 'Popular';

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

            return this.get({id: brand.id}).then((fullBrand) => {
              brands.push(fullBrand);
            })

          }).then(() => {
            resolve(brands);
          })

        });

      });

    };

    this.addLiked = (id) => {

      likes.push(id);
      localStorageService.set('likedBrands', likes);
       console.log('addLiked', likes)
      Server.post('brand.follow', {"brandId": id, "follow": 1});

    };

    this.removeLiked = (id) => {

      likes = likes.filter((item) => item != id);
      localStorageService.set('likedBrands', likes);
      Server.post('brand.follow', {"brandId": id, "follow": 0});

    };

    this.getLiked = () => {

      return new Promise((resolve, reject) => {

        var brands = [];
        var likedBrands = [];

        this.getFiltered().then((b) => {

          brands =  b;

          Common.get('account.getBrandFollow').then((data) => {

              likes =  localStorageService.get('likedBrands') || [];

              if(! data) {
                likes.concat( _.difference(likes, data) );
              }

              likedBrands = brands.filter((item) => likes.indexOf(item.id) > -1);

          }).then(() => {

            return Promise.map(likedBrands, (brand) => {

              brand.isLiked = true;
              Category.get({brandId: brand.id}).then((c) => {
                brand.categories = c;
              })

            }).then(() => {

              resolve(likedBrands);

            });

          })
        })

      });




  };

    this.saveInLocalStorage = (likedBrands) => {

      localStorageService.set('likedBrands', likedBrands);

    };

  })

  .service('Settings', function ($http, localStorageService, Common) {

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

    this.saveInLocalStorage =  () => {

      localStorageService.set('Settings', settings);

    };

    this.getStaticPage =  (data) => {

      data = data || {};

      return Common.get('shop.staticPage', data);
    };

    this.getSexObj =  () => {

      return settings.sexObj;

    };

    this.setCurrenctSexIndex =  (index) => {

      settings.sexObj.chosenIndex = index;
      this.saveInLocalStorage();

    };

    this.signOut = () => {
      localStorageService.remove('token');
    }

    this.isLogIn = () => {
      var result = !!localStorageService.get('token');
      return result;
    }

    this.saveInLocalStorage();

  })

  .service('Alert', function ($http, $q, URL, Common) {

    this.get = function (data) {

      data = data || {};

      return Common.get('alert.filter', data);
    }

  })

  .service('Size', function ($http, $q, URL, Common) {

    this.getByItem = function (data) {

      data = data || {};

      return Common.get('item.getSize', data);
    }

    this.get = function() {

      return Common.get('reference.getSize');

    }

  })

  .service('Color', function ($http, $q, URL, Common) {

    this.get = function() {

      return Common.get('reference.getColor');

    }

  })

  .service('Address', function ($http, $q, URL, Common, Server) {

    this.get = (data) => {

      data = data || {};

      return new Promise((resolve, reject) => {

        Common.get('account.getAddress', data).then((data) => {
          if(data.err_code) {

            reject(data.message);

          }
          else {

            resolve([data]);

          }
        })

      })
    };

    this.add = (data) => {

      var address = data;
      var toSend = {
        location: data.city.id,
        street: data.street,
        house: data.build,
        zip: data.zip,
        phone: data.phone,
        fullname: data.fullname,
        email: data.email,
        building: data.building,
        flat: data.flat,
        entrance: data.entrance
      };

      return new Promise((resolve, reject) => {

        Server.post('account.addAddress', toSend).then((result) => {

          if(result.err_code) reject(result.message);
          else {
            resolve();
          }

        });

      })
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

  .service('Delivery', function ($http, $q, URL, Common) {

      this.get = function (data) {

        data = data || {};

        return Common.get('shop.getDelivery', data);
      };

    })

  .service('Payment', function ($http, $q, URL, Common) {

      this.get = function (data) {

        data = data || {};

        return Common.get('shop.getPayment', data);
      };

    })

  .service('Search', function ($http, $q, URL, Common) {

    this.get = function (str) {

      str = str || '';

      return Common.get('item.filter', {q: str});
    };

  })

  .service('Order', function ($http, $q, URL, Common, Server) {

    this.add = (data) => {

      return new Promise((resolve, reject) => {

        Server.post('basket.set', {
          sizeId: data.size.id,
          count: data.quantity
        }).then((basket) => {

          return Server.post('order.new', {
            paymentId: data.payment.id,
            deliveryId: data.delivery.id,
            addressId: data.address.addressId,
            price: data.size.price
          });

        }).then((order) => {

          if(order.err_code) reject();
          else  resolve();

        })

      })

    };

    this.get = (data) => {

      return Common.get('order.filter', data);

    }

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

  .service('Server', function ($http, $q, URL, localStorageService) {

    this.fetch = (url) => {

      return new Promise((resolve, reject) => {

     console.log(URL + url)


        $http({
          method: 'GET',
          url: URL + url,
          headers: {
            'token': localStorageService.get('token')
          }
        }).then((response) => {


          if(response.data.err_code) {

            if(response.data.err_code == 306) {
              localStorageService.remove('token');
              resolve({});

            } else {
              reject(new Error({message: response.data.message, err_code: response.data.err_code}));
            }

          } else {

            resolve(response.data);

          }

        });

      })
    };

    this.post = (url, data) => {

      return new Promise((resolve, reject) => {

        $http({
          method: 'POST',
          url: URL + url,
          headers: {
            'token': localStorageService.get('token')
          },
          data: JSON.stringify(data)
        }).then((response) => {

          if(response.data.err_code) {

            if(response.data.err_code == 306) {
              localStorageService.remove('token');
              resolve({});

            } else {
              reject(new Error({message: response.data.message, err_code: response.data.err_code}));
            }

          } else {

            resolve(response.data);

          }

        });

      })
    };

  })

  .service('Common', function ($http, $q, Cache, Server) {

    this.get = function (url, data) {

      return new Promise((resolve, reject) => {

        data = data || {};

        if (data.id) {
          url += `/${data.id}`;
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





