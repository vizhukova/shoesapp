import _ from 'lodash';

export default function($scope, $stateParams, $ionicPopover, $ionicModal, $timeout, $rootScope, $cordovaSocialSharing, $state, Item, Size, Location, Address, Brand, Settings, Delivery, Payment, Order, Main) {

  $scope.animation = 'slide-in-up';
  $scope.errors = {};

   $scope.product = {};
   $scope.chosenType = undefined; // переменная для хранения выбранного пункта меню корзины
   $scope.isOpenCardPage = false;
   $scope.basketData = {//даные для отправки в сервис для оформления заказа
     quantity: 1
   };
   var city = {}; // объект для сохранения данных о городе при сохранении нового адреса
   $scope.shipAddress = {}; // объект для сохранения нового адреса
   $scope.cardData  = {};// объект для соханения новых данных по карте
   $scope.addresses  = []; // все адреса данного пользователя
   $scope.delivery = []; //переменная для хранения вариантов доставки
   $scope.deliveryIdTmp;//переменная, для варианты доставки без подтверждения выбора
   $scope.isDisableScroll = $rootScope.isDisableScroll = false;

   var isDisableShare = false;

  $scope.$watch(function() {
    return $rootScope.isDisableScroll;
  }, function() {
    $scope.isDisableScroll = $rootScope.isDisableScroll;
  }, true);


  $scope.ready = () => {
    return $scope.sizes;
  };

  if($stateParams.id) {

      $scope.ready = () => {
        return $scope.item;
     };

    Item.get({id: $stateParams.id}).then((data) => {

      $scope.item = data;
      var brandIsLiked = Brand.isLiked(data.brandId);

      Main.setCurrentBrand({id: data.brandId, name: data.brandName, icon: data.brandIcon, isLiked: brandIsLiked});
      //$('#slider').update(updateTranslate);

      return Item.getFiltered({sectionId: $scope.item.sectionId});

    }).then((products) => {

      $scope.products = products;
      $scope.$apply();

    }).catch((error) => {

    })

    $scope.mainService = Main;

    //$scope.$watch('mainService.getCurrentBrand()', (newVal, oldVal) => {
    //  if (newVal !== oldVal) {
    //    $scope.digest();
    //  }
    //});

    $rootScope.$on("$routeChangeStart", function(args){
      console.error('$routeChangeStart')
       Main.setFollowButton(false);
    });

    $scope.$on('$destroy', function() {
      console.error('$routeChangeStart')
       Main.setFollowButton(false);
    });


  }


  $scope.goToBrand = (brand_id) => {

    $state.go("tab.brand", {id: brand_id});

  };


  var popups = [
    {name: 'basketPopover', url: './src/product/popover/basket.popover.html'},
    {name: 'moreInfo', url: 'src/brands/subtabs/more-info.html'},
    {name: 'detailPopover', url: './src/product/popover/detail.popover.html'},
    {name: 'login', url: './src/login/directives/login.popover.html'}
  ];


  var modals = [
    {name: 'errorModal', url: './src/login/directives/error.modal.html'},
    {name: 'fullScreenModal', url: './src/product/modal/full.screen.modal.html'}
  ];

  popups.map((popup)=>{
    $ionicPopover.fromTemplateUrl(popup.url, {
      scope: $scope,
      animation: $scope.animation,
      backdropClickToClose: false
    }).then((popover)=>{
      $scope[popup.name] = popover;
    });
  });

  $scope[`openmoreInfo`] = ()=>{
    $timeout(() => {
      $scope['moreInfo'].show();
      Main.setFollowButton(false);
    });
  };

  $scope[`opendetailPopover`] = ()=>{
    $timeout(() => {
      $scope['detailPopover'].show();
      Main.setFollowButton(false);
    });
  };

  $scope[`openlogin`] = ()=>{
    //$scope.isDisableScroll = true;
    $scope['login'].show();
    Main.setFollowButton(false);
  };

  modals.map((modal)=>{

    $ionicModal.fromTemplateUrl(modal.url, {
      scope: $scope,
      animation: $scope.animation
    }).then((mod)=>{

    $scope[modal.name] = mod;

    $scope[`open${modal.name}`] = () => {
    if(window.dragable) return
     mod.show();
     Main.setFollowButton(false);
    }

    $scope[`close${modal.name}`] = () => {
     mod.hide();
     Main.setFollowButton(true);
    }

    });
  });

  $scope.sliderClick = ($event) => {
    $event.stopPropagation();
  };

  $scope[`openbasketPopover`] = ()=>{

    var isLogIn = Settings.isLogIn();
    $scope.isScrollable = false;
    Main.setFollowButton(false);
    console.info('openbasketPopover')

    if(isLogIn) {

      $state.go('tab.order', {id: $scope.item.id});
      afterShowBasket();

    } else {

      $scope['login'].show();

    }

    //$rootScope.isDisableScroll = true;
    console.info('!!!!!!!!!!!!!!!!', $scope)

  };


// Execute action on hide popover
$scope.$on('popover.hidden', function() {
  // Execute action
  Main.setFollowButton(true);
  console.info('popover.hidden')
  //$scope.isDisableScroll = false;
});


  $scope.loginCallback = () => {

    $scope['login'].hide();
    //$scope[`openbasketPopover`]();
    $state.go('tab.order', {id: $scope.item.id});
    afterShowBasket();

  };

  $scope.isFocus = () => {
    return $scope.chosenType=='newAddress';
  };

  $scope.chooseDetails = (data) => {
    $scope.details = data;
  };

  $scope.addShipAddress = () => {

    Location.getbyZip({id:  $scope.shipAddress.zip}).then((data) => {

      if(! data) {
        $scope.errors = {zip: true};
        $scope.$digest();
        return;
      }

      city = data;

      if($scope.shipAddress.city != city.city) {
        $scope.shipAddress.city = city.city;
        $scope.$digest();

      } else {

        var toSend = _.clone($scope.shipAddress);
        toSend.city = city;

        Address.add(toSend).then((data) => {

          $scope.chosenType = '';
          $scope.shipAddress = {};
           getAddressData();
          console.log('Юху!!!!')
          $scope.$digest();

        }).catch(() => {

          $scope.err_message = 'Проверьте правильность введенных данных';
          $scope.openerrorModal();

        })

      }
    }).catch((err) => {
      $scope.err_message = 'Проверьте правильность введенного индекса';
      $scope.openerrorModal();
    });

  };

  $scope.changeQuantityProduct = (value) => {

    if( (value < 0 && $scope.basketData.quantity > 0) || value > 0) {
      $scope.basketData.quantity += value;
    }
  };

  $scope.setChosenType = (type) => { //запоминает на какой пункт корзины нажал пользователь
    $scope.chosenType = $scope.chosenType == type ? undefined : type;
  };

  $scope.newAddressForm = () => {
    $scope.chosenType  =  $scope.chosenType =='newAddress' ? 'address' : 'newAddress';
  };

  $scope.setDeliveryIdTmp = (id) => {
    $scope.deliveryIdTmp =  id;
  };

  $scope.chooseShippingMethod = (id) => {
    $scope.basketData.delivery  =  _.find($scope.delivery, {id: id});

    Payment.get({id: $scope.basketData.delivery.id}).then((payments) => {

        $scope.payments = payments;
        console.log('PAYMENT', payments)

    })

  };

  $scope.choosePayment = (id) => {
    $scope.basketData.payment = _.find($scope.payments, {id: id});
  };

  $scope.chooseAddress = (id) => {
    $scope.basketData.address = _.find($scope.addresses, {addressId: id});
  };

  $scope.openCardData = (data) => {
    $scope.isOpenCardPage = data;
  };

  $scope.setBasketData = (data) => {
    _.assign($scope.basketData, data);
   $scope.chosenType = undefined;
  };

  $scope.like = (product) => {

      if(! product.isLiked) {
        Item.addLiked(product.id).catch(() => {

        })
      } else {
        Item.removeLiked(product.id).catch(() => {

        })
      }

    product.isLiked = !product.isLiked;

    };

  $scope.checkout = ($event) => {

    debugger
    $event.stopPropagation();

      Order.add($scope.basketData).then(() => {

         $scope['basketPopover'].hide();
         $scope.err_message = 'Заказ успешно оформлен';
         $scope.openerrorModal();

      }).catch(() => {

         $scope.err_message = 'Ошибка оформления заказа';
         $scope.openerrorModal();

      })

  };

  function getAddressData() {

    Address.get().then((data) => {

    $scope.addresses = data;
    $scope.basketData.address = data[data.length - 1];
    console.log('ADDDRESSSSSS', data)

    if(data.length === 0) {

      throw new Error();

    } else {

      return Delivery.get({id: data[data.length - 1].addressId});

    }

  }).then((delivery) => {

    $scope.delivery = delivery;

    $scope.basketData.delivery = delivery[delivery.length - 1];

    return Payment.get({id: delivery.id})

  }).then((payments) => {

      $scope.payments = payments;
      console.log('PAYMENT', payments)

  }).catch((error) => {

  })

  };

  function afterShowBasket() {

    $scope.chosenType = 'size';

    Size.getByItem({id: $scope.item.id}).then((s) => {

      $scope.sizes = s || [];
      $scope.basketData.size = $scope.sizes[0];
      $scope.basketData.size.size = $scope.basketData.size.size.replace(/\s/g, '');

    });

   getAddressData();
  }

  $scope.shareAnywhere = function(item) {

    if(isDisableShare) return;

    isDisableShare = true;

                                /*socialType, message,    image,    link*/
    $cordovaSocialSharing.share(     '',     item.name, item.img, item.url).then(() => {
      isDisableShare = false;
    }).catch(() => {
      isDisableShare = false;
    })
  }

}
