angular.module('starter.config', [])

// .value('URL', '/api/')
// .value('URL', 'http://localhost:8100/api/')
// .value('URL', 'http://shoes.mikero.ru/api/')
.value('URL', 'https://selectologie.ru/api/') // domain for sending requests from app

.value('pushwooshConfig', {
  appid : "D2EF1-88C05",
  projectid: "994032173270", // for Android
  serviceName: 'GCM' // is optional for Windows Phone (wp8)
});


