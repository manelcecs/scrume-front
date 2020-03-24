var gulp = require('gulp');
var sonarqubeScanner = require('sonarqube-scanner');
 
gulp.task('default', function(callback) {
  sonarqubeScanner({
    serverUrl : "https://sonarcloud.io",
    token : "6dfb8282f44f277d4b0bb6252ab83232eda818b5",
    options : {
      "sonar.organization": "scrume-front"
    }
  }, callback);
});