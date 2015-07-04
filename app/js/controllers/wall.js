'use strict';
/* global angular */

var controllersModule = require('./_index');
var PhotoSwipe = require('photoswipe');
var PhotoSwipeUI_Default = require('../components/photoswipe-ui-default');
var moment = require('moment');
/**
 * @ngInject
 */
function WallCtrl($scope, $rootScope, $window, AccountsService) {

    var vm = this;
    var term = '';
    $scope.newWallOptions = {};
    $scope.newWallOptions.headerColour = '#3c8dbc';
    $scope.newWallOptions.headerPosition = 'Top';
    $scope.newWallOptions.layoutStyle = 1;

    function hexToRgb(hex) {
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        }
        //Selects foreground colour as black or white based on background
    function colourCalculator(rgb) {
        var o = Math.round(((parseInt(rgb.r) * 299) + (parseInt(rgb.g) * 587) + (parseInt(rgb.b) * 114)) / 1000);
        if (o > 125) {
            return '#000000';
        } else {
            return '#FFFFFF';
        }
    }

    $scope.$watch('newWallOptions.headerColour', function() {
        if ($scope.newWallOptions.headerColour)
            $scope.newWallOptions.headerForeColour = colourCalculator(hexToRgb($scope.newWallOptions.headerColour));
    });

    $scope.$watch('newWallOptions.mainHashtagText', function() {
        if ($scope.newWallOptions.mainHashtagText)
            if ($scope.newWallOptions.mainHashtagText.length !== 0) {
                if ($scope.newWallOptions.mainHashtagText[0] != '#') {
                    $scope.newWallOptions.mainHashtag = '#' + $scope.newWallOptions.mainHashtagText;
                } else {
                    $scope.newWallOptions.mainHashtag = $scope.newWallOptions.mainHashtagText;
                }
            }
    });

    $scope.proceed = function() {
        console.log("clicked");
        $('.nav-tabs > .active').next('li').find('a').trigger('click');
    };

    $scope.start = function() {
        //construct term
        var dataParams = encodeURIComponent(JSON.stringify($scope.newWallOptions));
        $scope.newWallOptions['term'] = term;
        $('#wall-modal').modal('toggle');
        console.log($rootScope.root.twitterSession);
        if ($rootScope.root.twitterSession) {
            //save wall
            console.log("Saving wall");
            var saveData = {};
            saveData.screen_name = $rootScope.root.twitterSession.screen_name;
            saveData.apps = {};
            saveData.apps.wall = $scope.newWallOptions;
            AccountsService.updateData(saveData);
        }
        $window.open('/wall/display?data=' + dataParams, '_blank');
    };

    $scope.resetDate = function() {
        $scope.newWallOptions.sinceDate = null;
        $scope.newWallOptions.untilDate = null;
    }

    var init = function() {
        // if ($rootScope.root.twitterSession){
        //     AccountsService.getData({screen_name:$rootScope.root.twitterSession.screen_name}).then(function(result){
        //         console.log(result);
        //     },
        //     function(error){

        //     });
        // }
        //if ($rootScope.root.twitterSession){
        AccountsService.getData("aneeshd16").then(function(result) {
                console.log(result.accounts[0].apps.wall.walls);
                $scope.userWalls = result.accounts[0].apps.wall.walls;
                $scope.screen_name = "sjjsn";
            },
            function(error) {

            });
        //}
    }

    init();
}

controllersModule.controller('WallCtrl', ['$scope', '$rootScope', '$window', 'AccountsService', WallCtrl]);
