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

  var products = [
    {
      src: 'http://moderoute.com/wp-content/uploads/oxford-shoes-2.jpg',
      brand: 'Green Wing',
      title: 'Postman Oxford Oro',
      cost: 269,
      discount: false,
      ribbon: '48% OFF'
    },
    {
      src: 'http://moderoute.com/wp-content/uploads/oxford-shoes-2.jpg',
      brand: 'Green Wing',
      title: 'Postman Oxford Oro',
      cost: 269,
      discount: '160'
    },
    {
      src: 'http://moderoute.com/wp-content/uploads/oxford-shoes-2.jpg',
      brand: 'Green Wing',
      title: 'Postman Oxford Oro',
      cost: 269,
      discount: '160'
    },
    {
      src: 'http://moderoute.com/wp-content/uploads/oxford-shoes-2.jpg',
      brand: 'Green Wing',
      title: 'Postman Oxford Oro',
      cost: 269,
      discount: '160'
    },
    {
      src: 'http://moderoute.com/wp-content/uploads/oxford-shoes-2.jpg',
      brand: 'Green Wing',
      title: 'Postman Oxford Oro',
      cost: 269,
      discount: '160'
    },
    {
      src: 'http://moderoute.com/wp-content/uploads/oxford-shoes-2.jpg',
      brand: 'Green Wing',
      title: 'Postman Oxford Oro',
      cost: 269,
      discount: '160'
    },
    {
      src: 'http://moderoute.com/wp-content/uploads/oxford-shoes-2.jpg',
      brand: 'Green Wing',
      title: 'Postman Oxford Oro',
      cost: 269,
      discount: '160'
    },
    {
      src: 'http://moderoute.com/wp-content/uploads/oxford-shoes-2.jpg',
      brand: 'Green Wing',
      title: 'Postman Oxford Oro',
      cost: 269,
      discount: '160'
    }
  ];

  this.get = function(){

    return brands;

  };

  this.getProducts = function() {

    return products;

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



.service('Content', function ($http, $q, URL) {

  var categories = {};
  var category;

  var items = [
    {
      src: 'http://moderoute.com/wp-content/uploads/oxford-shoes-2.jpg',
      brand: 'Green Wing',
      title: 'Postman Oxford Oro',
      cost: 269,
      discount: false,
      ribbon: '48% OFF'
    },
    {
      src: 'http://moderoute.com/wp-content/uploads/oxford-shoes-2.jpg',
      brand: 'Green Wing',
      title: 'Postman Oxford Oro',
      cost: 269,
      discount: '160'
    },
    {
      src: 'http://moderoute.com/wp-content/uploads/oxford-shoes-2.jpg',
      brand: 'Green Wing',
      title: 'Postman Oxford Oro',
      cost: 269,
      discount: '160'
    },
    {
      src: 'http://moderoute.com/wp-content/uploads/oxford-shoes-2.jpg',
      brand: 'Green Wing',
      title: 'Postman Oxford Oro',
      cost: 269,
      discount: '160'
    },
    {
      src: 'http://moderoute.com/wp-content/uploads/oxford-shoes-2.jpg',
      brand: 'Green Wing',
      title: 'Postman Oxford Oro',
      cost: 269,
      discount: '160'
    },
    {
      src: 'http://moderoute.com/wp-content/uploads/oxford-shoes-2.jpg',
      brand: 'Green Wing',
      title: 'Postman Oxford Oro',
      cost: 269,
      discount: '160'
    },
    {
      src: 'http://moderoute.com/wp-content/uploads/oxford-shoes-2.jpg',
      brand: 'Green Wing',
      title: 'Postman Oxford Oro',
      cost: 269,
      discount: '160'
    },
    {
      src: 'http://moderoute.com/wp-content/uploads/oxford-shoes-2.jpg',
      brand: 'Green Wing',
      title: 'Postman Oxford Oro',
      cost: 269,
      discount: '160'
    }
  ];

  this.setCategory = (category) => {

  };

  // Get current category widgets content
  this.fetch = (currentCategory) => {
    return $q((resolve, reject)=> {
      $http.get(URL+currentCategory).then((response)=>{}, (error)=>{
        categories[currentCategory] = [
          {
            type: 'likedCat'
          },
          {
            type: 'likedSlider',
            title: 'BEST SELLERS',
            items: items,
            count: 150,
            query: {}
          },
          {
            type: 'likedSlider',
            title: 'SHOES ON SALE',
            items: items,
            count: 40,
            sale: true,
            query: {}
          },
          {
            type: 'gallerySlider',
            title: 'TOP 10 WOMEN BRANDS',
            items: [
              {
                src: 'http://looks-awesome.com/wp-content/uploads/2015/06/Shopkeeper-----Responsive-WordPress-Theme.jpg'
              },
              {
                src: 'http://looks-awesome.com/wp-content/uploads/2015/06/Shopkeeper-----Responsive-WordPress-Theme.jpg'
              },
              {
                src: 'http://looks-awesome.com/wp-content/uploads/2015/06/Shopkeeper-----Responsive-WordPress-Theme.jpg'
              },
              {
                src: 'http://looks-awesome.com/wp-content/uploads/2015/06/Shopkeeper-----Responsive-WordPress-Theme.jpg'
              },
              {
                src: 'http://looks-awesome.com/wp-content/uploads/2015/06/Shopkeeper-----Responsive-WordPress-Theme.jpg'
              },
              {
                src: 'http://looks-awesome.com/wp-content/uploads/2015/06/Shopkeeper-----Responsive-WordPress-Theme.jpg'
              },
              {
                src: 'http://looks-awesome.com/wp-content/uploads/2015/06/Shopkeeper-----Responsive-WordPress-Theme.jpg'
              },
              {
                src: 'http://looks-awesome.com/wp-content/uploads/2015/06/Shopkeeper-----Responsive-WordPress-Theme.jpg'
              },
              {
                src: 'http://looks-awesome.com/wp-content/uploads/2015/06/Shopkeeper-----Responsive-WordPress-Theme.jpg'
              },
              {
                src: 'http://looks-awesome.com/wp-content/uploads/2015/06/Shopkeeper-----Responsive-WordPress-Theme.jpg'
              },
            ],
            sale: false

          },
          {
            type: 'gallerySlider',
            title: 'NEW ON SPRING',
            items: [
              {
                src: 'http://looks-awesome.com/wp-content/uploads/2015/06/Shopkeeper-----Responsive-WordPress-Theme.jpg'
              },
              {
                src: 'http://looks-awesome.com/wp-content/uploads/2015/06/Shopkeeper-----Responsive-WordPress-Theme.jpg'
              },
              {
                src: 'http://looks-awesome.com/wp-content/uploads/2015/06/Shopkeeper-----Responsive-WordPress-Theme.jpg'
              },
              {
                src: 'http://looks-awesome.com/wp-content/uploads/2015/06/Shopkeeper-----Responsive-WordPress-Theme.jpg'
              },
              {
                src: 'http://looks-awesome.com/wp-content/uploads/2015/06/Shopkeeper-----Responsive-WordPress-Theme.jpg'
              },
              {
                src: 'http://looks-awesome.com/wp-content/uploads/2015/06/Shopkeeper-----Responsive-WordPress-Theme.jpg'
              },
              {
                src: 'http://looks-awesome.com/wp-content/uploads/2015/06/Shopkeeper-----Responsive-WordPress-Theme.jpg'
              },
              {
                src: 'http://looks-awesome.com/wp-content/uploads/2015/06/Shopkeeper-----Responsive-WordPress-Theme.jpg'
              },
              {
                src: 'http://looks-awesome.com/wp-content/uploads/2015/06/Shopkeeper-----Responsive-WordPress-Theme.jpg'
              },
              {
                src: 'http://looks-awesome.com/wp-content/uploads/2015/06/Shopkeeper-----Responsive-WordPress-Theme.jpg'
              },
            ],
            sale: false

          },
          {
            type: 'gallerySlider',
            title: '10 TERRIFIC BRANDS ON SALE',
            items: [
              {
                src: 'http://looks-awesome.com/wp-content/uploads/2015/06/Shopkeeper-----Responsive-WordPress-Theme.jpg'
              },
              {
                src: 'http://looks-awesome.com/wp-content/uploads/2015/06/Shopkeeper-----Responsive-WordPress-Theme.jpg'
              },
              {
                src: 'http://looks-awesome.com/wp-content/uploads/2015/06/Shopkeeper-----Responsive-WordPress-Theme.jpg'
              },
              {
                src: 'http://looks-awesome.com/wp-content/uploads/2015/06/Shopkeeper-----Responsive-WordPress-Theme.jpg'
              },
              {
                src: 'http://looks-awesome.com/wp-content/uploads/2015/06/Shopkeeper-----Responsive-WordPress-Theme.jpg'
              },
              {
                src: 'http://looks-awesome.com/wp-content/uploads/2015/06/Shopkeeper-----Responsive-WordPress-Theme.jpg'
              },
              {
                src: 'http://looks-awesome.com/wp-content/uploads/2015/06/Shopkeeper-----Responsive-WordPress-Theme.jpg'
              },
              {
                src: 'http://looks-awesome.com/wp-content/uploads/2015/06/Shopkeeper-----Responsive-WordPress-Theme.jpg'
              },
              {
                src: 'http://looks-awesome.com/wp-content/uploads/2015/06/Shopkeeper-----Responsive-WordPress-Theme.jpg'
              },
              {
                src: 'http://looks-awesome.com/wp-content/uploads/2015/06/Shopkeeper-----Responsive-WordPress-Theme.jpg'
              },
            ],
            sale: true

          },
          {
            type: 'tileSlider',
            title: 'MEET A NEW SHOES',
            subtitle: 'Can you handle these shoes?',
            items: [
              {
                src: 'http://kanyewestshoes.us.com/94-570-thickbox/kanye-west-shoes-women-originals-kanye-west-yeezy-750-boost-grey-b35309.jpg'
              },
              {
                src: 'http://kanyewestshoes.us.com/94-570-thickbox/kanye-west-shoes-women-originals-kanye-west-yeezy-750-boost-grey-b35309.jpg'
              },
              {
                src: 'http://kanyewestshoes.us.com/94-570-thickbox/kanye-west-shoes-women-originals-kanye-west-yeezy-750-boost-grey-b35309.jpg'
              },
              {
                src: 'http://kanyewestshoes.us.com/94-570-thickbox/kanye-west-shoes-women-originals-kanye-west-yeezy-750-boost-grey-b35309.jpg'
              },
              {
                src: 'http://kanyewestshoes.us.com/94-570-thickbox/kanye-west-shoes-women-originals-kanye-west-yeezy-750-boost-grey-b35309.jpg'
              },
              {
                src: 'http://kanyewestshoes.us.com/94-570-thickbox/kanye-west-shoes-women-originals-kanye-west-yeezy-750-boost-grey-b35309.jpg'
              },
              {
                src: 'http://kanyewestshoes.us.com/94-570-thickbox/kanye-west-shoes-women-originals-kanye-west-yeezy-750-boost-grey-b35309.jpg'
              },
              {
                src: 'http://kanyewestshoes.us.com/94-570-thickbox/kanye-west-shoes-women-originals-kanye-west-yeezy-750-boost-grey-b35309.jpg'
              }
            ],
            count: 48,
            query: {}
          },
          {
            type: 'tileSlider',
            title: 'MEET A NEW SHOES',
            subtitle: 'Can you handle these shoes?',
            items: [
              {
                src: 'http://kanyewestshoes.us.com/94-570-thickbox/kanye-west-shoes-women-originals-kanye-west-yeezy-750-boost-grey-b35309.jpg'
              },
              {
                src: 'http://kanyewestshoes.us.com/94-570-thickbox/kanye-west-shoes-women-originals-kanye-west-yeezy-750-boost-grey-b35309.jpg'
              },
              {
                src: 'http://kanyewestshoes.us.com/94-570-thickbox/kanye-west-shoes-women-originals-kanye-west-yeezy-750-boost-grey-b35309.jpg'
              },
              {
                src: 'http://kanyewestshoes.us.com/94-570-thickbox/kanye-west-shoes-women-originals-kanye-west-yeezy-750-boost-grey-b35309.jpg'
              },
              {
                src: 'http://kanyewestshoes.us.com/94-570-thickbox/kanye-west-shoes-women-originals-kanye-west-yeezy-750-boost-grey-b35309.jpg'
              },
              {
                src: 'http://kanyewestshoes.us.com/94-570-thickbox/kanye-west-shoes-women-originals-kanye-west-yeezy-750-boost-grey-b35309.jpg'
              },
              {
                src: 'http://kanyewestshoes.us.com/94-570-thickbox/kanye-west-shoes-women-originals-kanye-west-yeezy-750-boost-grey-b35309.jpg'
              },
              {
                src: 'http://kanyewestshoes.us.com/94-570-thickbox/kanye-west-shoes-women-originals-kanye-west-yeezy-750-boost-grey-b35309.jpg'
              }
            ],
            count: 48,
            query: {}
          },
          {
            type: 'thematicSlider',
            title: 'TOP THEMATIC SHOES',
            items: [
              {
                suptitle: 'SHOES RULE',
                title: 'Some them text here',
                subtitle: 'Shop Now',
                footer: 'By Simon Isaack, Co-Founder of Fatherly.com',
                src: 'http://media.new.mensxp.com/media/content/2016/Feb/indian-custom-made-shoe-brands-that-provide-world-class-quality980-1456481998_980x457.jpg'
              },
              {
                suptitle: 'SHOES RULE',
                title: 'Some them text here',
                subtitle: 'Shop Now',
                footer: 'By Simon Isaack, Co-Founder of Fatherly.com',
                src: 'http://media.new.mensxp.com/media/content/2016/Feb/indian-custom-made-shoe-brands-that-provide-world-class-quality980-1456481998_980x457.jpg'
              },
              {
                suptitle: 'SHOES RULE',
                title: 'Some them text here',
                subtitle: 'Shop Now',
                footer: 'By Simon Isaack, Co-Founder of Fatherly.com',
                src: 'http://media.new.mensxp.com/media/content/2016/Feb/indian-custom-made-shoe-brands-that-provide-world-class-quality980-1456481998_980x457.jpg'
              },
              {
                suptitle: 'SHOES RULE',
                title: 'Some them text here',
                subtitle: 'Shop Now',
                footer: 'By Simon Isaack, Co-Founder of Fatherly.com',
                src: 'http://media.new.mensxp.com/media/content/2016/Feb/indian-custom-made-shoe-brands-that-provide-world-class-quality980-1456481998_980x457.jpg'
              }
            ],
            count: 48,
            query: {}
          },
          {
            type: 'gallerySlider',
            title: 'LUXURY BRANDS WE LOVE',
            items: [
              {
                src: 'http://looks-awesome.com/wp-content/uploads/2015/06/Shopkeeper-----Responsive-WordPress-Theme.jpg'
              },
              {
                src: 'http://looks-awesome.com/wp-content/uploads/2015/06/Shopkeeper-----Responsive-WordPress-Theme.jpg'
              },
              {
                src: 'http://looks-awesome.com/wp-content/uploads/2015/06/Shopkeeper-----Responsive-WordPress-Theme.jpg'
              },
              {
                src: 'http://looks-awesome.com/wp-content/uploads/2015/06/Shopkeeper-----Responsive-WordPress-Theme.jpg'
              },
              {
                src: 'http://looks-awesome.com/wp-content/uploads/2015/06/Shopkeeper-----Responsive-WordPress-Theme.jpg'
              },
              {
                src: 'http://looks-awesome.com/wp-content/uploads/2015/06/Shopkeeper-----Responsive-WordPress-Theme.jpg'
              },
              {
                src: 'http://looks-awesome.com/wp-content/uploads/2015/06/Shopkeeper-----Responsive-WordPress-Theme.jpg'
              },
              {
                src: 'http://looks-awesome.com/wp-content/uploads/2015/06/Shopkeeper-----Responsive-WordPress-Theme.jpg'
              },
              {
                src: 'http://looks-awesome.com/wp-content/uploads/2015/06/Shopkeeper-----Responsive-WordPress-Theme.jpg'
              },
              {
                src: 'http://looks-awesome.com/wp-content/uploads/2015/06/Shopkeeper-----Responsive-WordPress-Theme.jpg'
              },
            ],
            sale: false

          },
          {
            type: 'gallerySlider',
            title: '11 EMERGING BRANDS TO KNOW',
            items: [
              {
                src: 'http://looks-awesome.com/wp-content/uploads/2015/06/Shopkeeper-----Responsive-WordPress-Theme.jpg'
              },
              {
                src: 'http://looks-awesome.com/wp-content/uploads/2015/06/Shopkeeper-----Responsive-WordPress-Theme.jpg'
              },
              {
                src: 'http://looks-awesome.com/wp-content/uploads/2015/06/Shopkeeper-----Responsive-WordPress-Theme.jpg'
              },
              {
                src: 'http://looks-awesome.com/wp-content/uploads/2015/06/Shopkeeper-----Responsive-WordPress-Theme.jpg'
              },
              {
                src: 'http://looks-awesome.com/wp-content/uploads/2015/06/Shopkeeper-----Responsive-WordPress-Theme.jpg'
              },
              {
                src: 'http://looks-awesome.com/wp-content/uploads/2015/06/Shopkeeper-----Responsive-WordPress-Theme.jpg'
              },
              {
                src: 'http://looks-awesome.com/wp-content/uploads/2015/06/Shopkeeper-----Responsive-WordPress-Theme.jpg'
              },
              {
                src: 'http://looks-awesome.com/wp-content/uploads/2015/06/Shopkeeper-----Responsive-WordPress-Theme.jpg'
              },
              {
                src: 'http://looks-awesome.com/wp-content/uploads/2015/06/Shopkeeper-----Responsive-WordPress-Theme.jpg'
              },
              {
                src: 'http://looks-awesome.com/wp-content/uploads/2015/06/Shopkeeper-----Responsive-WordPress-Theme.jpg'
              },
            ],
            sale: false

          },
          {
            type: 'gallerySlider',
            title: 'STANDOUT SHOES BRANDS',
            items: [
              {
                src: 'http://looks-awesome.com/wp-content/uploads/2015/06/Shopkeeper-----Responsive-WordPress-Theme.jpg'
              },
              {
                src: 'http://looks-awesome.com/wp-content/uploads/2015/06/Shopkeeper-----Responsive-WordPress-Theme.jpg'
              },
              {
                src: 'http://looks-awesome.com/wp-content/uploads/2015/06/Shopkeeper-----Responsive-WordPress-Theme.jpg'
              },
              {
                src: 'http://looks-awesome.com/wp-content/uploads/2015/06/Shopkeeper-----Responsive-WordPress-Theme.jpg'
              },
              {
                src: 'http://looks-awesome.com/wp-content/uploads/2015/06/Shopkeeper-----Responsive-WordPress-Theme.jpg'
              },
              {
                src: 'http://looks-awesome.com/wp-content/uploads/2015/06/Shopkeeper-----Responsive-WordPress-Theme.jpg'
              },
              {
                src: 'http://looks-awesome.com/wp-content/uploads/2015/06/Shopkeeper-----Responsive-WordPress-Theme.jpg'
              },
              {
                src: 'http://looks-awesome.com/wp-content/uploads/2015/06/Shopkeeper-----Responsive-WordPress-Theme.jpg'
              },
              {
                src: 'http://looks-awesome.com/wp-content/uploads/2015/06/Shopkeeper-----Responsive-WordPress-Theme.jpg'
              },
              {
                src: 'http://looks-awesome.com/wp-content/uploads/2015/06/Shopkeeper-----Responsive-WordPress-Theme.jpg'
              }
            ],
            sale: false

          },
          {
            type: 'categoryMenu'
          }
        ]
        resolve(categories[currentCategory])
      })
    })
  }
});

