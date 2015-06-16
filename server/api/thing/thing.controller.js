'use strict';

var _ = require('lodash');
var Twitter = require('twitter');
var sentiment = require('sentiment');
var hashmap = {};
var stream;
var tweetCount = 0;
var tweetTotalSentiment = 0;
//Get this data from your twitter apps dashboard
var client = new Twitter({
    "consumer_key": "7ycsyWcZOY9LPsyrg5ISnYenv",
    "consumer_secret": "RnitNFdtdi0WyzdqsTV6L1KHvZhsuoSx5RYqSxkuEU0bQf7k0l",
    "access_token_key": "75732597-LNy2MqE08F9faucfdnKOo3shKGhBGOayAeij918gV",
    "access_token_secret": "wdBBPQ9PwqBM686ZvAOvoe8wZd1XRW8y1FL2BL8Jkig2D",
    "oauth_signature_method": "HMAC-SHA1"
});

var offsetData = {
        "10800": "IQ",
        "-14400": "RU",
        "18000": "PK",
        "20700": "NP",
        "-18000": "BR",
        "14400": "AE",
        "43200": "NZ",
        "12600": "IR",
        "25200": "TH",
        "-10800": "AR",
        "3200": "IT",
        "21600": "BD",
        "28800": "MY",
        "16200": "AF",
        "19800": "IN",
        "7200": "ZW",
        "32400": "JP",
        "3600": "DE",
        "-16200": "VE",
        "36000": "PG",
        "-21600": "MX"
    }
    //http://blog.safe.com/2014/03/twitter-stream-api-map/
    //http://www.html5rocks.com/en/tutorials/frameworks/angular-websockets/
    //http://www.ibm.com/developerworks/library/wa-nodejs-app/
    //https://dev.twitter.com/streaming/overview/request-parameters#locations
    //https://apps.twitter.com/app/8399553

exports.twitterContinueWatch = function(req, res) {
    console.log('##############  twitterContinueWatch ###############')
    console.log("data:'" + JSON.stringify(hashmap) + "'+tweetTotalSentiment'" + tweetTotalSentiment + "', 'tweetCount': '" + tweetCount);
    res.json({
        'data': hashmap,
        'tweetTotalSentiment': tweetTotalSentiment,
        'tweetCount': tweetCount
    });
    console.log('#####################################################')
};
exports.twitterWatch = function(req, res) {
    if (stream != undefined) {
        stream.abort();
    }
    var phrase = "'#" + req.params.hashtag + "'";
    console.log('Tracking phrase:\t ' + phrase);
    stream = client.stream('statuses/filter', {
        track: '#' + req.params.hashtag + '',
        language: 'en'
    }, function(stream) {
        stream.on('data', function(data) {
            var loc = data.user.location;
            var offset = data.user.utc_offset;
            console.log("data.user:\t" + JSON.stringify(data.user));
            console.log("text:\t" + JSON.stringify(data.text));
            console.log("Lang:\t" + JSON.stringify(data.lang));
            if (data.lang === 'en' && hashmap[area] != 'undefined') {
                var area = offsetData[offset];
                console.log("hashmap[area]:\t" + area);
                if (hashmap[area] == null) {
                    hashmap[area] = 1;
                } else {
                    var val = hashmap[area];
                    hashmap[area] = val + 1;
                }
                sentiment(data.text, function(err, result) {
                    tweetCount++;
                    console.log("tweetCount:\t" + tweetCount);
                    tweetTotalSentiment += result.score;
                    console.log("'data'" + hashmap + "'tweetTotalSentiment'" + tweetTotalSentiment + "', 'tweetCount': '" + tweetCount);
                    res.json({
                        'data': hashmap,
                        'tweetTotalSentiment': tweetTotalSentiment,
                        'tweetCount': tweetCount
                    });
                }); //end of sentiment
            } //end of if lang
        });
    });
};
