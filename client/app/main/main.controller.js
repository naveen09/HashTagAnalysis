'use strict';

angular.module('hashtagAnalyticsApp')
.controller('MainCtrl', ['$scope', '$http','$timeout', function ($scope, $http,timeout) {
    var self = this;
    self.images = [
    {file: 'assets/images/default.png', desc: 'Default Emotion'},
    {file: 'assets/images/angry.png', desc: 'Angry'},
    {file: 'assets/images/happy.png', desc: 'Happy'},
    {file: 'assets/images/normal.png', desc: 'Normal'}
    ];
    self.loading = 'assets/images/loading.gif';
    self.showLoading = false;
    self.searchInput = '';
    self.chartData =[];
    self.refresh = false;
    self.imageSrc = self.images[0].file;
    self.imageDesc = self.images[0].desc;
    self.clearSearch = function () {
        this.searchInput = '';
        self.imageSrc = self.images[0].file;
        self.refresh =false;
        self.chartData =[];
        self.showLoading = false;
    }
    self.process = function(data){
        self.chartData = self.getChartData(data.data);
        var tweetTotalSentiment = data.tweetTotalSentiment;
        var tweetCount = data.tweetCount;
        var avg = tweetTotalSentiment / tweetCount;
            if (avg > 0.5) { // happy
                self.imageSrc = self.images[2].file;
                self.imageDesc = self.images[2].desc;
            }else
            if (avg < -0.5) { // angry
                self.imageSrc = self.images[1].file;
                self.imageDesc = self.images[1].desc;
            }else{
                self.imageSrc = self.images[3].file;
                self.imageDesc = self.images[3].desc;
            }
            if(self.refresh){
                timeout(self.search,2000);
            }
        }
        self.getChartData = function(data){
            var chartData =[];
            for(var entry in data){
                if(entry!="undefined"){
                    chartData.push({'code': entry,'z':data[entry]});
                }
            }
            return chartData;
        }
        self.search = function () {
            timeout.cancel(self.search);
            self.showLoading = true;
            if(!self.refresh){
             $http.get('api/things/'+self.searchInput).success(function (data) {
                self.refresh =true;
                self.process(data);
            });
         }else{
            $http.get('api/things/watch/'+self.searchInput).success(function (data) {
             self.process(data);
         });
        }
    }
}]).directive("chart", function () {
    return {
        template: '<div id="chartContainer" style="height: 500px; min-width: 310px; max-width: 1024px; margin: 0 auto"></div>',
        restrict: 'E',
        scope: {
            data: "="
        },
        replace: true,
        controller: 'MainCtrl',
        link: function ($scope, element, $attrs) {

            $scope.$watch("data", function (dd) {

                var mapData = Highcharts.geojson(Highcharts.maps['custom/world']);

                var mapChart = $(element).highcharts('Map', {
                    chart: {
                        renderTo: $(element).attr('id')
                    },
                    mapNavigation: {
                        enabled: true
                    },
                    title: {
                        text: 'Twitter hashtag Analysis'
                    },
                    colors: ['#3AC5AA', '#0066FF', '#00CCFF'],
                    xAxis: {
                        lineWidth: 0,
                        gridLineWidth: 0,
                        minorGridLineWidth: 0,
                        lineColor: 'transparent',
                        labels: {
                            enabled: false
                        },
                        minorTickLength: 0,
                        tickLength: 0
                    },
                    yAxis: {
                        title: false,
                        lineWidth: 0,
                        gridLineWidth: 0,
                        minorGridLineWidth: 0,
                        lineColor: 'transparent',
                        labels: {
                            enabled: false
                        },
                        minorTickLength: 0,
                        tickLength: 0
                    },
                    subtitle: {
                        text: 'Bubble graph based on hashtag intensity'
                    },
                    credits: false,
                    series: [
                    {
                        name: 'Countries',
                        mapData: mapData,
                        color: '#E0E0E0',
                        enableMouseTracking: false
                    },
                    {
                        type: 'mapbubble',
                        mapData: mapData,
                        name: 'HashTags',
                        joinBy: ['iso-a2', 'code'],
                        data: dd,
                        minSize: 4,
                        maxSize: '12%',
                        tooltip: {
                            pointFormat: '{point.code}: {point.z} tweets'
                        }
                    }
                    ]
                });

});
}
}
});