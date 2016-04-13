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

.service('Content', function ($http, $q, URL) {

  var categories = {};
  var category;

  this.setCategory = (category) => {

  }

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
