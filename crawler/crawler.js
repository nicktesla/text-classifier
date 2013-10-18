var nodeio, linksOnPage, lyricsFromLink, db;

nodeio = require('node.io');
db = require('../db/db');
db.loadDB();

var loadSong =  function(artist, title, lyrics){
	console.log("loadSong being called");
	var newSongObj = {};
	newSongObj['artist'] = artist;	
	newSongObj['title'] = title;
	newSongObj['lyrics'] = lyrics;
	//store the lyrics in a mongo table
	var newSong = new db.Song(newSongObj);
	newSong.save(function(err) {
		if(err){
			throw err;
		} else{
			console.log("saved with no errors!");
		}
	});
};
// generic utility for getting links on a page and running a function on each one
exports.linksOnPage = function(pageObj, linkSelector, doOnPage, contentSelector) {
	nodeio.scrape(function(){
		this.getHtml(pageObj.pageUrl, function(err, $) {
			var links = [];
			var i = 0;
			$(linkSelector).each(function(link) {
				var fullLink = pageObj.rootUrl + link.attribs.href
				links.push(fullLink);
				//run a function on each link
				console.log('getting lyrics for song: ', i);
				doOnPage(pageObj.artist, fullLink, contentSelector);
				i = i+1;
			});
			//this.emit(links);
		});
	});
}

// get the lyrics for a specific song 
exports.lyricsFromLink = function(artist, pageUrl, lyricsSelector) {
	console.log('calling lyrics from Link')
	nodeio.scrape(function(){
		this.getHtml(pageUrl, function(err, $) {
			var lyrics = "";
			$(lyricsSelector).each(function(lyricParagraph) {
				lyrics = lyrics + " " + lyricParagraph.text;
			});
			loadSong(artist, pageUrl, lyrics);
			//this.emit(lyrics)
		});
	});
}
