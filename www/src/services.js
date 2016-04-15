angular.module('starter.services', [])

.service('Category', function($http) {

  // Some fake testing data
  var categories = ['Women', 'Men', 'Kids', 'Beauty', 'Lifestyle'];

  // $http.get('').then(function(c){
  //
  //   categories = c;
  // });


  this.get = function(){

    return categories;
  }
})


.service('Brand', function($http, localStorageService) {

  // Some fake testing data
  var brands = [
    {
      name: 'Brand name',
      src: "http://www.fashion-brands.ru/MyWeb-Image/table/article_photos/field/photo/content-field/photo_content/content-type-field/photo_type/equality-field/id/equality/58796/width/460/1/1.jpg"
    }, {
      name: 'Brand name',
      src: "http://www.fashion-brands.ru/MyWeb-Image/table/article_photos/field/photo/content-field/photo_content/content-type-field/photo_type/equality-field/id/equality/58796/width/460/1/1.jpg"
    }, {
      name: 'Brand name',
      src: "http://www.fashion-brands.ru/MyWeb-Image/table/article_photos/field/photo/content-field/photo_content/content-type-field/photo_type/equality-field/id/equality/58796/width/460/1/1.jpg"
    }, {
      name: 'Brand name',
      src: "http://www.fashion-brands.ru/MyWeb-Image/table/article_photos/field/photo/content-field/photo_content/content-type-field/photo_type/equality-field/id/equality/58796/width/460/1/1.jpg"
    }, {
      name: 'Brand name',
      src: "http://www.fashion-brands.ru/MyWeb-Image/table/article_photos/field/photo/content-field/photo_content/content-type-field/photo_type/equality-field/id/equality/58796/width/460/1/1.jpg"
    }, {
      name: 'Brand name',
      src: "http://www.fashion-brands.ru/MyWeb-Image/table/article_photos/field/photo/content-field/photo_content/content-type-field/photo_type/equality-field/id/equality/58796/width/460/1/1.jpg"
    }, {
      name: 'Brand name',
      src: "http://www.fashion-brands.ru/MyWeb-Image/table/article_photos/field/photo/content-field/photo_content/content-type-field/photo_type/equality-field/id/equality/58796/width/460/1/1.jpg"
    }, {
      name: 'Brand name',
      src: "http://www.fashion-brands.ru/MyWeb-Image/table/article_photos/field/photo/content-field/photo_content/content-type-field/photo_type/equality-field/id/equality/58796/width/460/1/1.jpg"
    }

  ];

  this.get = function(){

    return brands;

  };

  this.saveInLocalStorage = (chosenBrands) => {

     localStorageService.set('chosenBrands', chosenBrands);

  };
})



.service('Settings', function($http, localStorageService) {

  var settings = {

    sexObj : {
      sex : ['Women', 'Men', 'Both'],
      chosenIndex: 0
    },

    faq: 'test text faq',
    shippingAndReturns: 'test text shippingAndReturns',
    privacyPolicy: 'test text privacyPolicy',
    termsOfService: 'test text termsOfService'
  };

  this.saveInLocalStorage = function() {

     localStorageService.set('Settings', settings);

  };

  this.get = function(){

    return settings;
  };

  this.getSexObj = function() {

    return settings.sexObj;

  };

  this.setCurrenctSexIndex = function(index) {

    settings.sexObj.chosenIndex = index;
    this.saveInLocalStorage();

  };

  this.saveInLocalStorage();
})



.service('Widgets', function ($http, $q, URL) {

  var categories = {};

  // Get current category widgets content
  this.fetch = (currentCategory) => {
    return $q((resolve, reject)=> {
      $http.get(URL+currentCategory).then((response)=>{}, (error)=>{
        categories[currentCategory] = [
          {
            type: 'likedCat'
          },
          {
            type: 'likedSlider'
          },
          {
            type: 'likedSlider'
          },
          {
            type: 'likedSlider'
          },
          {
            type: 'likedSlider'
          },
          {
            type: 'likedSlider'
          },
          {
            type: 'tileSlider'
          },
          {
            type: 'tileSlider'
          },
          {
            type: 'tileSlider'
          },
          {
            type: 'likedSlider'
          },
          {
            type: 'likedSlider'
          },
          {
            type: 'likedSlider'
          },
          {
            type: 'categoryMenu'
          }
        ]
        resolve(categories[currentCategory])
      })
    })
  }
})
