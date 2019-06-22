require('dotenv').config()
var LastFMNode = require('lastfm').LastFmNode	

const lastfm = new LastFMNode({
	api_key: process.env.LFM_API_KEY,
	secret: process.env.LFM_SECRET
})


const username = 'farlklores'

// get the track that is currently playing
// either pass the track payload if there is 
// a currently playing track or null if there is not 
getNowPlaying = callback => user => {
	method = 'user.getRecentTracks'
	options = {
		limit: 1,
		user,
		handlers: {
			success: data => {
				npTrack = data.recenttracks.track[0]
				if(npTrack['@attr'] != undefined && npTrack['@attr']){
					getTrackScrobbles(user)(npTrack)(callback)
				}else{
					callback(null)
				}
			},
			error : err => {
				console.error(err)
			}
		}
	}	
	lastfm.request(method, options)
}

validateUsername = user => callback => {
	console.log('called this')
	method = 'user.getInfo'
	options = {
		user,
		handlers: {
			success: data => {
				// found a valid last fm user 
				callback(uname)(true)
			},
			error : err => {
				console.error(err)
				if(err.error === 6){
					callback(uname)(false)
				}
			}
		}
	}	
	lastfm.request(method, options)

}

getTrackScrobbles = username => track => callback => {
	method = 'track.getInfo'
	console.log('Playing: ', track.name, track.artist['#text'])
	options = {
		track: track.name,
		artist: track.artist['#text'],
		username,
		handlers: {
			success: data => {
				var payload = {
					username,
					name: data.track.name,
					scrobbles: data.track.userplaycount,
					artist: track.artist['#text'],
					album: track.album['#text'],
					image: track.image
				}
				callback(payload)
			},
			error: err => {
				console.error(err)
			}
		}
	}
	req = lastfm.request(method, options)
}

module.exports = {
	validateUsername,
	getNowPlaying
}
