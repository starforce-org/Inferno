'use strict';

/*--------------
	nightclub
  --------------*/
function urlify(str) {return str.replace(/(https?\:\/\/[a-z0-9-.]+(\/([^\s]*[^\s?.,])?)?|[a-z0-9]([a-z0-9-\.]*[a-z0-9])?\.(com|org|net|edu|tk)((\/([^\s]*[^\s?.,])?)?|\b))/ig, '<a href="$1" target="_blank">$1</a>').replace(/<a href="([a-z]*[^a-z:])/g, '<a href="http://$1').replace(/(\bgoogle ?\[([^\]<]+)\])/ig, '<a href="http://www.google.com/search?ie=UTF-8&q=$2" target="_blank">$1</a>').replace(/(\bgl ?\[([^\]<]+)\])/ig, '<a href="http://www.google.com/search?ie=UTF-8&btnI&q=$2" target="_blank">$1</a>').replace(/(\bwiki ?\[([^\]<]+)\])/ig, '<a href="http://en.wikipedia.org/w/index.php?title=Special:Search&search=$2" target="_blank">$1</a>').replace(/\[\[([^< ]([^<`]*?[^< ])?)\]\]/ig, '<a href="http://www.google.com/search?ie=UTF-8&btnI&q=$1" target="_blank">$1</a>');}

Server.urlify = urlify;

const nightclub = new Object();

function colorify(given_text){
	const sofar = "";
	const splitting = given_text.split("");
	const text_length = given_text.length;
	const colorification = true;
	const beginningofend = false;
	for (const i in splitting) {
		if (splitting[i] == "<" && splitting[i + 1] != "/") {
			//open tag <>
			colorification = false;
		}
		if (splitting[i] == "/" && splitting[i -  1] == "<") {
			//closing tag </>
			//find exact spot
			beginningofend = i;
		}
		if (beginningofend && splitting[i - 1] == ">") {
			colorification = true;
			beginningofend = false;
		}
		const letters = 'ABCDE'.split('');
		const color = "";
		for (const f = 0; f < 6; f++) {
			color += letters[Math.floor(Math.random() * letters.length)];
		}
		if (colorification) {
			if (splitting[i] == " ") sofar += " "; else sofar += "<font color='" + "#" + color + "'>" + splitting[i] + "</font>";
		} else sofar += splitting[i];

	}
	return sofar;
}
Server.colorify = colorify;
 
function colorify_absolute(given_text){
	const sofar = "";
	const splitting = given_text.split("");
	const text_length = given_text.length;
	for (i = 0; i < text_length; i++) {
		const color = (Math.random()*(0xFFFFFF+1)<<0).toString(16);
		if (splitting[i] == " ") sofar += " "; else sofar += "<font color='" + "#" + color + "'>" + splitting[i] + "</font>";
	}
	return sofar;
}
Server.colorify_absolute = colorify_absolute;

const nightclubify = Server.colorify;

exports.commands = {
	nightclub: function(target, room, user, connection) {
		if (!this.can('broadcast')) return this.sendReply('You must at least be voice in order to force us all to be disco dancing freakazoids.');
		if (nightclub[room.id]) return this.sendReply('This room is already engulfed in nightclubness.');
		nightclub[room.id] = true;
		room.addRaw('<div class="nightclub"><font size=6>' + nightclubify('LETS GET FITZY!! nightclub mode: ON!!!') + '</font><font size="2"> started by: ' + user.userid + '</font></div>');
	},
	dayclub: function(target, room, user, connection) {
		if (!this.can('broadcast')) return this.sendReply('You must at least be voice in order to force us all to stop dancin\'.');
		if (!nightclub[room.id]) return this.sendReply('This room is already in broad daylight.');
		delete nightclub[room.id];
		room.addRaw('<div class="nightclub"><font size=6>' + nightclubify('sizzle down now... nightclub mode: off.') + '</font><font size="2"> ended by: ' + user.userid + '</font></font>');
	},
};