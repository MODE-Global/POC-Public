import React from "react";
import GoogleMap from 'google-map-react';
import { LatLong, mapProps } from "../../interface/LoadSearchInterface";

const GoogleMaps = (props: mapProps) => {

  const getMiddle = (type: string, markers: LatLong[]) => {
    let values = markers.map(m => m[type == 'lat' ? 'lat' : 'lng']);
    let min = Math.min(...values);
    let max = Math.max(...values);
    if (type === 'lng' && (max - min > 180)) {
      values = values.map(val => val < max - 180 ? val + 360 : val);
      min = Math.min(...values);
      max = Math.max(...values);
    }
    let result = (min + max) / 2;
    if (type === 'lng' && result > 180) {
      result -= 360
    }
    return result;
  }

  const findCenter = (markers: LatLong[]) => {
    return {
      lat: getMiddle('lat', markers),
      lng: getMiddle('lng', markers)
    }
  }
  
  return (
    <div style={{ 'width': '700px', 'height': '400px' }}>
     <GoogleMap
           bootstrapURLKeys={{ key: props.apiKey }}
           defaultZoom={6}
           defaultCenter={findCenter(props.markers)}>
        {props.markers.map((value, i) => {
          return (
            <Marker markerClass='super-awesome-pin' lat={value.lat}
            lng={value.lng}  />
          )
        })}
         <Marker markerClass='origin-location' lat={props.origin.lat}lng={props.origin.lng} />
         <Marker markerClass='destination-location' lat={props.destination.lat}lng={props.destination.lng} />
      </GoogleMap>
    </div>
  );
}


const Marker = (props: any) => {
  return <span className={props.markerClass}>{}</span>
}


export default GoogleMaps



