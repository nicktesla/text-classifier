//import crawler
var crawler = require('./crawler');

//crawl some page for lyrics
var RG_ROOT, RG_ARTIST_URL, RG_SONG_SELECTOR, RG_TARGET;
RG_ROOT = "http://rapgenius.com"
RG_ARTIST_URL = "http://rapgenius.com/artists/Jay-z";
RG_SONG_SELECTOR = "a.song_name";
RG_PAGE_OBJ = {rootUrl: RG_ROOT, pageUrl: RG_ARTIST_URL, artist:"jay-z"};
RG_LYRICS_SELECTOR = ".lyrics a";

crawler.linksOnPage(RG_PAGE_OBJ, RG_SONG_SELECTOR, crawler.lyricsFromLink, RG_LYRICS_SELECTOR);
