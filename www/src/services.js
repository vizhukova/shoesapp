import Promise from 'bluebird';
import _ from 'lodash';
import moment from 'moment';

angular.module('starter.services', [])

  .service('Main', function ($http, $q, URL) {

    var currentBrand = {};
    var followButton = false;
    var isNavAvailable = true;

    this.setNavVisible = (value) => {
      isNavAvailable = value;
      console.log('setNavVisible', value)
    };

    this.getNavVisible = () => {
      console.log('getNavVisible', isNavAvailable)
      return isNavAvailable;
    };

    this.setCurrentBrand = (item) => {
      currentBrand = item || {};
      followButton = !item.isLiked;
      console.log('setCurrentBrand', item)
    }

    this.getCurrentBrand = () => {
      return currentBrand;
    }

    this.setFollowButton = (value) => {
      followButton = value && !currentBrand.isLiked;
      console.log('setFollowButton', value)
    }

    this.isFollowButton = () => {
      return followButton;
    }

  })

  .service('User', function (Common, Server, localStorageService) {
    /*
     curl --data "{"email":"test@test.ru","pass":"asdfsfd","firstName":"Ivan"}"  http://shoes.mikero.ru/api/auth.signUp --header "Content-Type:application/json"
     */

    this.signIn = function (data) {
      //return Server.post('auth.signIn', data);

      return new Promise((resolve, reject) => {

        Server.post('auth.signIn', data).then((result) => {
          localStorageService.set('token', result.token);
          resolve();
          console.log(result.token)

        }).catch((error) => {

          reject(error.message);

        })

      })

    };

    this.signUp = function (data) {

      return new Promise((resolve, reject) => {

        Server.post('auth.signUp', data).then((result) => {

          localStorageService.set('token', result.token);
          resolve();
          console.log('token', result.token)


        }).catch((error) => {

          reject(error.message)

        })

      })

    };

    this.forgotPassword = function (data) {

      return Server.post('auth.forgotPassword', data);

    };

    this.getUserInfo = function (data) {

      return new Promise((resolve, reject) => {

        Common.get('account.get').then((data) => {

          resolve(data.result);

        }).catch((err) => {

          reject(err);

        })

      })

    };


  })

  .service('Category', function (Common) {

    var activeCategory; // активная категория в верхнем горизонтальном меню

    this.setActive = (category) => {
      console.log('service Category setActive == ', category.name);
      activeCategory = category;
      console.log('activeCategory id=', category.id)
    };

    this.getActive = () => {
      return activeCategory;
    };

    this.get = (data) => {

      data = data || {};
      var categories = [];

      return new Promise((resolve, reject) => {

        Common.get('section.filter', data).then((data) => {
          var c = data.result;
          categories = c.filter((item) => {

            if (item.deptLevel === '1') return item;

            //if(item.deptLevel === 1) {
            //  item.items = c.filter((it) => it.deptLevel === 2 && it.parentId === item.id);
            //  return item;
            //}
          });
          resolve(categories);
        })

      })
    }

    this.getById = (id) => {

      return new Promise((resolve, reject) => {

        this.getAll().then((categories) => {

          var category = _.find(categories, {id: id});
          resolve(category);

        }).catch((err) => {

          reject(err);

        });

      })

    };

    this.getAll = (data) => {

      data = data || {};
      var categories = [];

      return new Promise((resolve, reject) => {

        Common.get('section.filter', data).then((data) => {
          var c = data.result;
          categories = c.filter((item) => {
            return item;
          });
          resolve(categories);
        })

      })
    };

    this.getFirstLevelParentNode = (childNodeId) => {

      return new Promise((resolve, reject) => {

        Common.get('section.filter').then((c) => {

          var categories = c.result;

          resolve(recursion(childNodeId));

          function recursion(nodeId) {

            var node = _.find(categories, {id: nodeId});

            if (node.parentId) {
              return recursion(node.parentId);
            } else {
              return node;
            }
          }

        }).catch((err) => {

          reject(err);

        })

      });

    };

    this.getArrayTree = (category_id) => {

      var categories = [];
      var tree = {};

      return new Promise((resolve, reject) => {

        this.getAll().then((c) => {

          categories = _.cloneDeep(c);
          var cat = _.find(categories, {id: category_id});


          var chieldCat = categories.filter((item) => item.parentId === cat.id);

          if (!chieldCat.length) {
            resolve(undefined);
            return;
          }

          if (cat.parentId) {

            tree = getTree(cat.id, [cat], categories);

          } else {

            tree = cat;

          }

          tree.items = chieldCat;
          resolve([tree]);

        });

      })
    }

    this.closeNode = (siblingNodeId) => {

      var tree = {};
      var categories = [];

      return new Promise((resolve, reject) => {

        this.getAll().then((c) => {

          categories = _.cloneDeep(c);

          var cat = _.find(categories, {id: siblingNodeId});

          if (cat.parentId) {

            var chieldCats = categories.filter((item) => item.parentId === cat.parentId)

            tree = getTree(cat.parentId, chieldCats, categories);
            tree.lastCosenNode = cat.parentId;

          } else {

            tree = categories.filter((item) => {
              if (item.deptLevel === '1') {
                item.items = [];
                return item;
              }
            });

          }

          resolve(tree);

        });

      })
    };

    function getTree(category_id, items, categories) {
      var category = _.find(categories, {id: category_id});
      category.items = items;
      if (category.parentId) return getTree(category.parentId, [category], categories);
      else return [category];
    }

  })

  .service('Item', function ($http, $q, URL, Common, Server, localStorageService) {

    var likes = [];
    var nav;

    this.getFiltered = function (data) {

      data = data || {};
      likes = localStorageService.get('likedItems') || [];

      return new Promise((resolve, reject) => {

        Common.get('item.filter', data).then((data) => {

          var items = data.result || [];

          items.count = data.nav.countRecord || 0;

          console.log(items.count)

          items.map((item) => {
            if (item) {
              item.isLiked = likes.indexOf(item.id) > -1;
            }
          });

          resolve(items);

        })

      });

    };

    this.resetNav = () => {
      nav = undefined;
    };

    this.getFilteredNav = function (data) {

      data = data || {};
      likes = localStorageService.get('likedItems') || [];

      return new Promise((resolve, reject) => {

        if (nav && nav.pageCurrent >= nav.pageCount && data.page >= nav.pageCount) {

          resolve([]);

        } else {

          Common.get('item.filter', data).then((data) => {

            var items = data.result || [];
            nav = data.nav || {};

            items.count = nav.countRecord || 0;

            items.map((item) => {
              if (item) {
                item.isLiked = likes.indexOf(item.id) > -1;
              }
            });

            resolve(items);

          })

        }

      });

    };

    this.get = function (data) {

      data = data || {};
      likes = localStorageService.get('likedItems') || [];


      return new Promise((resolve, reject) => {

        Common.get('item.get', data).then((data) => {
          var item = data.result;
          if (item) {

            item.isLiked = likes.indexOf(item.id) > -1;
          }
          resolve(item);
        })

      })
    };

    this.addLiked = (id) => {

      likes = localStorageService.get('likedItems') || [];

      likes.push(id);
      localStorageService.set('likedItems', likes);
      console.log('addLiked', likes)
      return Server.post('item.love', {"id": id, "love": 1});

    };

    this.removeLiked = (id) => {

      likes = localStorageService.get('likedItems') || [];

      likes = likes.filter((item) => item != id);
      localStorageService.set('likedItems', likes);
      return Server.post('item.love', {"id": id, "love": 0});

    };

    this.clearLikes = () => {
      localStorageService.set('likedItems', []);
    };

    this.getLiked = () => {

      return new Promise((resolve, reject) => {

        var products = [];

        this.getFiltered().then((p) => {

          products = p;

          Common.get('account.getLove').then((data) => {

            var result = data.result;

            likes = localStorageService.get('likedItems') || [];

            if (!result) {
              likes.concat(_.difference(likes, result));
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

    this.getFiltered = (data) => {

      return new Promise((resolve, reject) => {
        Common.get('brand.filter', data).then((data) => {
          resolve(data.result);
        }).catch((error) => {
          reject(error);
        })
      })

    };

    this.getFullFiltered = (data) => {

      var brands = {};

      return new Promise((resolve, reject) => {

        this.getFiltered(data).then((b) => {

          brands = b;

          Promise.map(brands, (brand, index) => {

            return Item.getFiltered(_.assign({}, {brandId: brand.id}, data)).then((products, i) => {

              brands[index].items = products;

              return Category.get({brandId: brand.id}).then((data) => {

                brands[index].categories = data;
                brands[index].isLiked = likes.indexOf(brands[index].id) > -1;

              }).then(() => {

                if (products[0]) {

                  return Item.get({id: products[0].id}).then((product) => {

                    brands[index].items[0] = product;

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

    this.getSales = (array) => {

      var brandsArr = _.cloneDeep(array);

      return new Promise((resolve, reject) => {

        Promise.map(brandsArr, (brand, index) => {

          return Item.getFiltered({feature: 'sales', brandId: brand.id}).then((products) => {

            brandsArr[index].items = products;
            brandsArr[index].sale = true;
            brandsArr[index].title = 'Распродажа';

          })

        }).then((result) => {

          resolve(brandsArr);

        })


      })

    };

    this.getNewArrivals = (array) => {

      var brandsArr = _.cloneDeep(array);

      return new Promise((resolve, reject) => {

        Promise.map(brandsArr, (brand, index) => {

          return Item.getFiltered({feature: 'sales', brandId: brand.id}).then((products) => {

            brandsArr[index].items = products;
            brandsArr[index].title = 'Новые поступления';

          })

        }).then((result) => {

          resolve(brandsArr);

        })


      })

    };

    this.getPopular = (data) => {

      var brands = {};

      return new Promise((resolve, reject) => {

        Common.get('brand.filter', {feature: 'popular'}).then((data) => {

          var b = data.result;
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

    this.get = (data) => {

      return new Promise((resolve, reject) => {
        Common.get('brand.get', data).then((data) => {

          var brand = data.result;

          if (brand) {
            brand.isLiked = likes.indexOf(brand.id) > -1;
          }
          resolve(brand);

        }).catch((error) => {

          reject(error);

        })
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

    this.clearLikes = () => {
      localStorageService.set('likedBrands', []);
    };

    this.getLiked = () => {

      return new Promise((resolve, reject) => {

        var brands = [];
        var likedBrands = [];

        this.getFiltered().then((b) => {

          brands = b;

          Common.get('account.getBrandFollow').then((data) => {

            var result = data.result;

            likes = localStorageService.get('likedBrands') || [];

            if (!result) {
              likes.concat(_.difference(likes, result));
            }

            likedBrands = brands.filter((item) => likes.indexOf(item.id) > -1);

          }).then(() => {

            return Promise.map(likedBrands, (brand) => {

              brand.isLiked = true;
              return Category.get({brandId: brand.id}).then((c) => {
                brand.categories = c;
              })

            }).then(() => {

              resolve(likedBrands);

            });

          })
        })

      });


    };

    this.hasLiked = () => {
      var likes = localStorageService.get('likedBrands') || [];
      return !!likes.length;
    };

    this.isLiked = (id) => {
      var likes = localStorageService.get('likedBrands') || [];
      return likes.indexOf(id) !== -1;
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

    this.saveInLocalStorage = () => {

      localStorageService.set('Settings', settings);

    };

    this.getStaticPage = (data) => {

      data = data || {};

      return new Promise((resolve, reject) => {
        Common.get('shop.staticPage', data).then((data) => {
          resolve(data.result);
        }).catch((err) => {
          reject(err);
        })
      })
    };

    this.getSexObj = () => {

      return settings.sexObj;

    };

    this.setCurrenctSexIndex = (index) => {

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

  .service('Facebook', function ($http) {

    this.getUserData = (clientId, accessToken) => {

      var url = `https://graph.facebook.com/${clientId}?fields=name,email&access_token=${accessToken}`;

      return new Promise((resolve, reject) => {
        $http({
          method: 'GET',
          url: url
        }).then((data) => {
          resolve(data);
        }).catch((err) => {
          reject(err);
        });
      });

    };

  })

  .service('pushNotification', function ($cordovaDevice, Server) {

    this.subscribe = (pushToken) => {

      return sendToServer('subscribe', pushToken);

    };

    this.unsubscribe = () => {

      return sendToServer('unsubscribe', '');

    };

    function sendToServer(method, pushToken) {

      var toSend = {
        deviceId: $cordovaDevice.getUUID(),
        method: method,
        platform: $cordovaDevice.getPlatform().toLowerCase(),
        pushToken: pushToken

      };

      console.log(toSend)

      return new Promise((resolve, reject) => {

        Server.post('account.pushNotification', toSend).then((result) => {

          resolve(result);

        }).catch(function (err) {

          reject(err);

        });

      })

      // Server.post('account.pushNotification', toSend).then((result) => {
      //
      //   resolve(result);
      //
      // }).catch((error) => {
      //
      //   reject(error);
      //
      // })

    }
  })

  .service('Size', function ($http, $q, URL, Common) {

    this.getByItem = function (data) {

      data = data || {};

      return new Promise((resolve, reject) => {
        Common.get('item.getSize', data).then((data) => {
          resolve(data.result || []);
        }).catch((err) => {
          reject(err);
        })
      })
    }

    this.get = function () {

      return new Promise((resolve, reject) => {
        Common.get('reference.getSize').then((data) => {
          resolve(data.result || []);
        }).catch((err) => {
          reject(err);
        })
      })

    }

  })

  .service('Color', function ($http, $q, URL, Common) {

    this.get = function () {

      return new Promise((resolve, reject) => {
        Common.get('reference.getColor').then((data) => {
          resolve(data.result || []);
        }).catch((err) => {
          reject(err);
        })
      })

    }

  })

  .service('Alert', function ($http, $q, URL, Common) {

    this.get = function (data) {

      data = data || {};

      return new Promise((resolve, reject) => {
        Common.get('alert.filter', data).then((data) => {
          resolve(data.result);
        }).catch((err) => {
          reject(err);
        })
      })
    }

  })

  .service('Address', function ($http, $q, URL, Common, Server) {

    this.get = (data) => {

      data = data || {};

      return new Promise((resolve, reject) => {

        Common.get('account.getAddress', data).then((data) => {

          var result = data.result;
          var response = [];
          if (result) response.push(result);

          resolve(response);

        }).catch((error) => {

          reject(error);

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

          resolve(result);

        }).catch((error) => {

          reject(error);

        })

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

      return new Promise((resolve, reject) => {
        Common.get('shop.getLocationByZip', data).then((data) => {
          resolve(data.result);
        }).catch((err) => {
          reject(err);
        })
      })

    };

    this.getbyName = function (data) {

      data = data || {};

      return new Promise((resolve, reject) => {
        Common.get('shop.getLocationByName', data).then((data) => {
          resolve(data.result);
        }).catch((err) => {
          reject(err);
        })
      })

    };

  })

  .service('Delivery', function ($http, $q, URL, Common) {

    this.get = function (data) {

      data = data || {};

      return new Promise((resolve, reject) => {
        Common.get('shop.getDelivery', data).then((data) => {
          resolve(data.result);
        }).catch((err) => {
          reject(err);
        })
      })

    };

  })

  .service('Payment', function ($http, $q, URL, Common) {

    this.get = function (data) {

      data = data || {};

      return new Promise((resolve, reject) => {
        Common.get('shop.getPayment', data).then((data) => {
          resolve(data.result);
        }).catch((err) => {
          reject(err);
        })
      })
    };

  })

  .service('Search', function ($http, $q, URL, Common) {

    this.get = function (str) {

      str = str || '';

      return new Promise((resolve, reject) => {
        Common.get('item.filter', {q: str}).then((data) => {
          resolve(data.result);
        }).catch((err) => {
          reject(err);
        })
      })
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

          resolve();

        }).catch((error) => {

          reject(error);

        })

      })

    };

    this.get = (data) => {

      return new Promise((resolve, reject) => {
        Common.get('order.filter', data).then((data) => {
          resolve(data.result);
        }).catch((err) => {
          reject(err);
        })
      })

    }

  })

  .service('Banner', function ($http, $q, URL, Common) {

    this.getLogin = (data) => {

      return new Promise((resolve, reject) => {
        Common.get('banner.filter', {where: 'signin'}).then((data) => {
          resolve(data.result);
        }).catch((err) => {
          reject(err);
        })
      })

    }

    this.getMain = (data) => {

      var filterBy = data || {};
      _.assign(filterBy, {where: 'main'});

      return new Promise((resolve, reject) => {
        Common.get('banner.filter', filterBy).then((data) => {
          resolve(data.result);
        }).catch((err) => {
          reject(err);
        })
      })

    }

  })

  .service('Info', function ($http, $q, URL, Common) {

    this.get = () => {
      return new Promise((resolve, reject) => {
        Common.get('shop.getInfo').then((data) => {
          resolve(data.result);
        }).catch((err) => {
          reject(err);
        })
      })

    }

  })

  .service('Cache', function () {

    var cache = {};

    this.get = (key) => {

      var dataToReturn = cache[key];
      if (dataToReturn) {

        var today = moment();

        if (moment.max(today, dataToReturn.endTime) == today) {

          return undefined;

        } else {
          return {result: dataToReturn.data, nav: dataToReturn.nav};

        }
      } else {

        return undefined;

      }

    };

    this.set = (key, data) => {

      cache[key] = {
        data: data.result,
        endTime: moment().add(data.ttl, 'ms'),
        nav: data.nav
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


          if (response.data.err_code) {

            if (response.data.err_code == 306) {
              localStorageService.remove('token');
              resolve({});

            } else {
              reject(new Error(response.data.message, response.data.err_code));
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

          if (response.data.err_code) {

            if (response.data.err_code == 306) {
              localStorageService.remove('token');
              resolve({});

            } else {
              reject(new Error(response.data.message, response.data.err_code));
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

        var dataToReturn = Cache.get(url);

        if (!dataToReturn) {

          Server.fetch(url).then((data) => {

            data.ttl = 1000;

            Cache.set(url, data);
            console.log('Server format', {result: data.result, nav: data.nav})
            resolve({result: data.result, nav: data.nav});

          }).catch((err) => {

            reject(err);

          })

        } else {
          console.log('Cache format', dataToReturn)
          resolve(dataToReturn);
        }

      })
    };

  });





