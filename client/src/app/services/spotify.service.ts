import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { ArtistData } from '../data/artist-data';
import { AlbumData } from '../data/album-data';
import { TrackData } from '../data/track-data';
import { ResourceData } from '../data/resource-data';
import { ProfileData } from '../data/profile-data';
import { TrackFeature } from '../data/track-feature';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
	expressBaseUrl:string = 'http://localhost:8888';

  constructor(private http:HttpClient) { }

  private sendRequestToExpress(endpoint:string):Promise<any> {
    return this.http.get<any>(`${this.expressBaseUrl}/${endpoint}`).toPromise();
    
    //done
    //TODO: use the injected http Service to make a get request to the Express endpoint and return the response.
    //the http service works similarly to fetch(). It may be useful to call .toPromise() on any responses.
    //update the return to instead return a Promise with the data from the Express server
    //Note: toPromise() is a deprecated function that will be removed in the future.
    //It's possible to do the assignment using lastValueFrom, but we recommend using toPromise() for now as we haven't
    //yet talked about Observables. https://indepth.dev/posts/1287/rxjs-heads-up-topromise-is-being-deprecated
    
  }

  aboutMe():Promise<ProfileData> {
    //This line is sending a request to express, which returns a promise with some data. We're then parsing the data 
    return this.sendRequestToExpress('me').then((data) => {
      return new ProfileData(data);
    });
  }

  searchFor(category:string, resource:string):Promise<ResourceData[]> {
      var searchEndpoint:string = "search";
      var encodeResource = encodeURIComponent(resource);

      return this.sendRequestToExpress(`${searchEndpoint}/${category}/${encodeResource}`).then(data =>{

        //taking response from Promise fulfilled, then isolate the data and return it into whatever data
        //need to get artists data (whatevre we need for ArtistData) out of data and return it into the ArtistData thing
        //print out the data to console and see
       
        if (category === "artist") {
          console.log(data["artists"].items.map(item  => new ArtistData(item)));
          return data["artists"].items.map(item  => new ArtistData(item));
        } else if (category === "album") {
          return data["albums"].items.map(item => new AlbumData(item));
        } else if (category === "track") {
          return data["tracks"].items.map(item => new TrackData(item));
        } 
      });
      
      //maybe done 
      
    //TODO: identify the search endpoint in the express webserver (routes/index.js) and send the request to express.
    //Make sure you're encoding the resource with encodeURIComponent().
    //Depending on the category (artist, track, album), return an array of that type of data.
    //JavaScript's "map" function might be useful for this, but there are other ways of building the array.

  }

  getArtist(artistId:string):Promise<ArtistData> {
    var encodeArtistId = encodeURIComponent(artistId);
    var artEndp:string = "artist";
    return this.sendRequestToExpress('artist/' + encodeArtistId).then(data=>{
        return new ArtistData(data)
    });
    //maybe done

    //TODO: use the artist endpoint to make a request to express.
    //Again, you may need to encode the artistId.
  }

getRelatedArtists(artistId: string): Promise<ArtistData[]> {
  // TODO: use the related artist endpoint to make a request to express and return an array of artist data
  var encodeArtistId = encodeURIComponent(artistId);
  var relArtEndp: string = "artist-related-artists";
  
  const relatedArtists = []
  return this.sendRequestToExpress(`${relArtEndp}/${encodeArtistId}`).then((data) => {
    data['artists'].forEach(element => {
      relatedArtists.push(new ArtistData(element))
    });
    return relatedArtists;
  });
}

  getTopTracksForArtist(artistId:string):Promise<TrackData[]> {
    //TODO: use the top tracks endpoint to make a request to express.
    var encodeArtistId = encodeURIComponent(artistId);
    var artEndp:string = "artist-top-tracks";
    
    const topTracks = []
    return this.sendRequestToExpress(`${artEndp}/${encodeArtistId}`).then(data=>{
      data["tracks"].forEach(element =>{
        topTracks.push(new TrackData(element))
      });
      return topTracks
    });
  }

  getAlbumsForArtist(artistId:string):Promise<AlbumData[]> {
    //TODO: use the albums for an artist endpoint to make a request to express.
    var encodeArtistId = encodeURIComponent(artistId);
    var artEndp:string = "artist-albums";

    const albumsForArtist = []
    return this.sendRequestToExpress(`${artEndp}/${encodeArtistId}`).then(data=>{
      data["items"].forEach(element => {
        albumsForArtist.push(new AlbumData(element))
      })
      return albumsForArtist;
    });
    
  }

  getAlbum(albumId:string):Promise<AlbumData> {
    var encodeAlbID = encodeURIComponent(albumId);
    return this.sendRequestToExpress("album/"+ encodeAlbID).then(data=>{
      return new AlbumData(data);
    });
    //TODO: use the album endpoint to make a request to express.
  }

  getTracksForAlbum(albumId:string):Promise<TrackData[]> {
    var albId = encodeURIComponent(albumId);
    var a:string = "album-tracks";
    const trAlb = []
    return this.sendRequestToExpress("album-tracks/"+albId).then(data=>{
      data["items"].forEach(element =>{
        trAlb.push(new TrackData(element));
      })
      return trAlb;
      
      
    });
    //TODO: use the tracks for album endpoint to make a request to express.
  }

  getTrack(trackId:string):Promise<TrackData> {
    var trackID = encodeURI(trackId);
    return this.sendRequestToExpress("track/"+trackID).then((data)=>{
      return new TrackData(data);
    })
    //TODO: use the track endpoint to make a request to express.
    
  }

  getAudioFeaturesForTrack(trackId:string):Promise<TrackFeature[]> {
    //TODO: use the audio features for track endpoint to make a request to express.
    var trackID = encodeURI(trackId);
    
    const audioFeat = []
    return this.sendRequestToExpress("track-audio-features/"+trackID).then(data=>{
      
      TrackFeature.FeatureTypes.forEach(element =>{
        audioFeat.push(new TrackFeature(element, data[element]));
      })
      return audioFeat
    })
  }
}
