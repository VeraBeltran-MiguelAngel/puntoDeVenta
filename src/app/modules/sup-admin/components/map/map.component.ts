// map.component.ts
import { Component } from '@angular/core';
//import {} from 'googlemaps';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent {
  /*mostrarMapa() {
    const direccion = '1600 Amphitheatre Parkway, Mountain View, CA';
    
    const script = document.createElement('script');
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBkuTrNKH3-eHnuPd8zgM3RfbYUjErGtsQ&callback=initMap';
    document.body.appendChild(script);
    window['initMap'] = () => {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: direccion }, (results: any, status: any) => {
        if (status === 'OK') {
          const mapOptions = {
            center: results[0].geometry.location,
            zoom: 15,
          };
          const mapElement = document.getElementById('map');
          if (mapElement) {
            const map = new google.maps.Map(mapElement, mapOptions);
            new google.maps.Marker({
              position: results[0].geometry.location,
              map: map,
            });
          } else {
            console.error('No se pudo encontrar el elemento del mapa');
          }
        } else {
          alert('La dirección no se pudo encontrar en el mapa');
        }
      });
    };
  }*/
}

declare global {
  interface Window { initMap: any; }
}