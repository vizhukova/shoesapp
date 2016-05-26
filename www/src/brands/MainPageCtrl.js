import _ from 'lodash'

export default function ($stateParams, $scope, $state, $ionicPopover, $rootScope, $sce, Brand, Category, Item) {

  $scope.animation = 'slide-in-up';
  $scope.chosenBrands = []; //выбор бредов на главной страницы для подписки, если нет ни одного бренда, на который подписан пользователь
  $scope.chosenBrand = {};

   $scope.hasLiked = Brand.hasLiked();

  $scope.$watch('hasLiked', (newVal, oldVal) => {

    console.log('hasLiked', $scope.hasLiked)

    if (newVal) {

      $rootScope.showDoneButton(false);

      //Category.get().then((data) => {
      //  $scope.cats = data;
      //  $scope.chosenCategorId = data[0].id;
      //});

      Brand.getLiked().then((data) => {

        $scope.brands = data;
        //$scope.brands.push({id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 5}, {id: 6}, {id: 7}, {id: 8}, {id: 9})
        $scope.$digest();

        $scope.brands.map((brand) => {

          Item.getFiltered({brandId: brand.id}).then((items) => {

            if(items.length != 0) {
              return  Item.get({id: items[0].id});
            }
          }).then((item) => {
            brand.items = [item];

            //brand.items[0].imgs = [
            //  'http://www.cuter.cn/wp-content/uploads/2013/07/1374153473.jpg',
            //  'http://img0.joyreactor.cc/pics/post/full/%D0%BA%D0%BE%D1%82%D1%8D-%D0%9A%D0%BB%D0%B8%D0%BA%D0%B0%D0%B1%D0%B5%D0%BB%D1%8C%D0%BD%D0%BE-%D0%BE%D0%B1%D0%BE%D0%B8-%D0%BA%D1%80%D0%B0%D1%81%D0%B8%D0%B2%D1%8B%D0%B5-%D0%BA%D0%B0%D1%80%D1%82%D0%B8%D0%BD%D0%BA%D0%B8-2629498.jpeg',
            //  'http://goodimg.ru/img/kartinki-zverey4.jpg'
            //]
          })

        });

         Brand.getSales(data).then((data) => {
          $scope.brandSales = data;
           console.log('getSales', data)
           $scope.$digest();
        });

        Brand.getNewArrivals(data).then((data) => {
          $scope.newArrivals = data;
          console.log('newArrivals', data)
           $scope.$digest();
        });

        console.log('likedBrands', data)
      });

      $scope.goToBrand = (brand_id) => {
        $state.go("tab.brand", {id: brand_id});
      };

      $scope.toBrandProducts = (id, params) => {

        var brand_id = $stateParams.id || id;
        //var category_id = $stateParams.id ? id : undefined;

        var toSend = _.assign({}, params, {brandId: brand_id});
        $state.go("tab.brand-products", toSend);

      };

      $scope.openbrandPopover = (brand_id) => {
        Brand.getProducts({id: brand_id}).then((products) => {
          $scope.chosenBrand = products;
          $scope.brandPopover.show();
          console.log('$scope.chosenBrand', $scope.chosenBrand)
        });
      };

      $scope.goToBrandFollowPage = () => {
        $state.go("tab.brand-follow")
      };


    } else {

      $scope.follow = (brand) => {

        if (brand.isLiked) {

          Brand.removeLiked(brand.id);
          brand.isLiked = false;

        } else {

          Brand.addLiked(brand.id);
          brand.isLiked = true;

        }
      };

      Brand.getFiltered().then((brands) => {
        $scope.brands = brands;
      });

      $scope.onBlindChange = (index) => {

        if ($scope.chosenBrands.indexOf(index) == -1) {

          $scope.chosenBrands.push(index);
        } else {

          $scope.chosenBrands = _.filter($scope.chosenBrands, (item) => item != index);

        }

        if(! $scope.chosenBrands.length) {

          $rootScope.showDoneButton(false);

        } else {

          $rootScope.showDoneButton(true);

        }

      };


      var update = () => {

        console.log($scope.chosenBrands)
        Brand.saveInLocalStorage($scope.chosenBrands);

        $scope.hasLiked = Brand.hasLiked();

        //Brand.getLiked().then((data) => {
        //  $scope.likedBrands = data;
        //  if (data.length > 0) $scope.$digest();
        //  console.log('likedBrands', data)
        //});

      };

      $rootScope.updateLikedBrands = update;


      $scope.isSelected = (index) => $scope.chosenBrands.indexOf(index) !== -1;

      $scope.filter = function (params) {

        if ($stateParams.id) params.brandId = $stateParams.id;

        Item.getFiltered(params).then((data) => {

          $scope.products = data;

        });
      }

    }


  })

}
