require("dotenv").config();

var fs = require('fs');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');

var keys = require('./keys');

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
var omdbKey = keys.omdb;

var command = process.argv[2];
var select = process.argv[3];


function getTweet(){
    client.get('statuses/user_timeline', function(err, tweet, response) {
        if (err) {
            throw err;
        }

    for (var i = 0; i < tweet.length; i++) {
            console.log(tweet[i].created_at + ': ' + tweet[i].text);
        };
    
    });
};

function getSong(){
    var song = 'The Sign - Ace of Base';
        if (select) {
            song = select;
        }
        spotify.search({ type: 'track', query: song }, function(err, data) {
            if (err) {
            throw err;
            }
            console.log('Artist: ' + data.tracks.items[0].artists[0].name);
            console.log('Song: ' + data.tracks.items[0].name);
            console.log('Preview: ' + data.tracks.items[0].preview_url);
            console.log('Album: ' + data.tracks.items[0].album.name);
        });
};

function getMovie(){
    var movie = 'Mr. Nobody';
       if (select) {
         movie = select;
       }

       request('https://www.omdbapi.com/?t=' + movie + '&y=&plot=short&apikey='+ omdbKey.api_key, function (err, res, body) {
           if(err){
               throw err;
           }

         var data = JSON.parse(body);
         console.log('Title: ' + data.Title);
         console.log('Year: ' + data.Year);
         console.log('Rated: ' + data.Rated);
         console.log('Rotted Tomatoes: ' + data.Ratings[1].Value);
         console.log('Country: ' + data.Country);
         console.log('Language: ' + data.Language);
         console.log('Plot: ' + data.Plot);
         console.log('Actors: ' + data.Actors);
       });
};

function getThis(){
    fs.readFile('random.txt', 'UTF8', function(err, data) {
        if (err) {
            throw err;
        }
        else {
            output = data.split(',');
            command = output[0];
            select= output[1];
            liri();
        }
    });
}

function liri() {
    switch(command){
        case 'my-tweets':
            getTweet();
            break;
        case 'spotify-this-song':
            getSong();
            break;
        case 'movie-this':
            getMovie();
            break;
        case 'do-what-it-says':
            getThis();
            break;
    }
};

liri();