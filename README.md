# Мобильное приложение selectologie.com #

Приложение реализовано на http://ionicframework.com/

###### Порядок установки приложени:
* клонируем репозиторий
* выполняем команду npm i
* выполняем команду bower i
*в файле www/src/config.json заполнить данные для pushwoosh и домен, на который должны уходить запросы из приложения
* выполняем команду gulp build
* выполняем команду gulp sass
* выполняем команду ionic state restore
* выполняем команду cordova plugin add phonegap-facebook-plugin --variable APP_ID=value --variable APP_NAME=value, где value  -соответсвующие данные аккаунта разработчика facebook
* В файле platforms/android/build.gradle добавить строки 
allprojects {
    configurations {
        all*.exclude group: 'com.android.support', module: 'support-v4'
    }
}
* Для сборки на android можно использовать команду cordova build android, для сборки на ios запустить cordova prepare и воспользоватья xcode.

### Публикация приложения ###

[http://ionicframework.com/docs/guide/publishing.html](http://ionicframework.com/docs/guide/publishing.html)