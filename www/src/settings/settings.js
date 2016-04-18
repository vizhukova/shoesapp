export default function($scope, $state,  $ionicPopover, Settings) {

  $scope.settings = Settings.get();
  $scope.sexObj = Settings.getSexObj();

  $scope.toPromo = () => {
    $state.go("tab.me-settings-promo");
  };

  $scope.toShowMe = () => {
    $state.go("tab.me-settings-showMe");
  };

  $scope.toFaq = () => {
    $state.go("tab.me-settings-faq");
  };

  $scope.toShippingAndReturns = () => {
    $state.go("tab.me-settings-shippingAndReturns");
  };

  $scope.toPrivacyPolicy = () => {
    $state.go("tab.me-settings-privacyPolicy");
  };

  $scope.toTermsOfService = () => {
    $state.go("tab.me-settings-termsOfService");
  };

  $scope.toSurpriseMe = () => {
    //$state.go("tab.product");
  };

}
