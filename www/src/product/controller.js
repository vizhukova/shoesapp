import _ from 'lodash';

export default function($scope, $stateParams, $ionicPopover, $ionicModal, $timeout, $cordovaSocialSharing, $cordovaKeyboard, $state, Item, Size, Location, Address, Brand, Settings, Delivery, Payment, Order) {

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
   var isDisableShare = false;


  console.log(window.cordova.plugins.Keyboard)
  $cordovaKeyboard.hideAccessoryBar(true);
  $cordovaKeyboard.disableScroll(true);
  $cordovaKeyboard.close();

  $scope.ready = () => {
    return $scope.sizes;
  };

  if($stateParams.id) {

      $scope.ready = () => {
        return $scope.item;
     };

    Item.get({id: $stateParams.id}).then((data) => {

      $scope.item = data;
      //$('#slider').update(updateTranslate);

      return Item.getFiltered({sectionId: $scope.item.sectionId});

    }).then((products) => {

      $scope.products = products;
      $scope.$digest();

    }).catch((error) => {

    })
  }


  $scope.goToBrand = (brand_id) => {

    $state.go("tab.brand", {id: brand_id});

  };


  var popups = [
    {name: 'moreInfo', url: 'src/brands/subtabs/more-info.html'},
    {name: 'detailPopover', url: './src/product/popover/detail.popover.html'},
    {name: 'basketPopover', url: './src/product/popover/basket.popover.html'},
    {name: 'login', url: './src/login/directives/login.popover.html'}
  ];

  var modals = [
    {name: 'errorModal', url: './src/login/directives/error.modal.html'},
    {name: 'fullScreenModal', url: './src/product/modal/full.screen.modal.html'}
  ];

  popups.map((popup)=>{
    $ionicPopover.fromTemplateUrl(popup.url, {
      scope: $scope,
      animation: $scope.animation
    }).then((popover)=>{
      $scope[popup.name] = popover;
    });
  });

  $scope[`openmoreInfo`] = ()=>{
    $scope['moreInfo'].show();
  };

  $scope[`opendetailPopover`] = ()=>{
    $scope['detailPopover'].show();
  };

  $scope[`openlogin`] = ()=>{
    $scope['login'].show();
  };

  modals.map((modal)=>{

    $ionicModal.fromTemplateUrl(modal.url, {
      scope: $scope,
      animation: $scope.animation
    }).then((mod)=>{

    $scope[modal.name] = mod;

    $scope[`open${modal.name}`] = () => {
     mod.show();
    }

    $scope[`close${modal.name}`] = () => {
     mod.hide();
    }

    });
  });

  $scope.sliderClick = ($event) => {
    $event.stopPropagation();
  };

  $scope[`openbasketPopover`] = ()=>{

    var isLogIn = Settings.isLogIn();

    if(isLogIn) {

      $scope['basketPopover'].show();
      afterShowBasket();

    } else {

      $scope['login'].show();

    }

  };

  $scope.loginCallback = () => {

    $scope['login'].hide();
    $scope['basketPopover'].show();

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

    //$timeout(() => {
    //  if($scope.chosenType === 'newAddress') {
    //    $( "#fio" ).focus();
    //  }
    //}, 100);

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
  }

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

  $scope.checkout = () => {

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

                                /*socialType, message, image, link*/
    $cordovaSocialSharing.share('', item.name, item.img, item.url).then(() => {
      isDisableShare = false;
    }).catch(() => {
      isDisableShare = false;
    })
  }

}
