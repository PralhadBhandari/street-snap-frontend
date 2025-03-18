import { Component, ElementRef } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { CommonService } from '../services/common.service';

@Component({
  selector: 'app-generate-map',
  standalone: true,
  imports: [GoogleMapsModule],
  templateUrl: './generate-map.component.html',
  styleUrls: ['./generate-map.component.scss']
})
export class GenerateMapComponent {
  private map!: google.maps.Map; // Store the map object
  private infoWindow!: google.maps.InfoWindow; // InfoWindow for displaying content
  mapData: any;

  constructor(private el: ElementRef, private common_service: CommonService) {}

  ngOnInit(): void {
    this.observeCurrentPostData();
  }

  observeCurrentPostData(): void {
    this.common_service.currentPostDataObservable.subscribe((data: any) => {
      console.log('mapData :', data);
      this.mapData = data;

      // Initialize the map only once we have the mapData
      if (this.mapData && this.mapData.location) {
        this.loadMap();
      }
    });
  }

  // Function to initialize the Google Map
  loadMap(): void {
    // Ensure that we have valid location data before creating the map
    const location = {
      lat: Number(this.mapData.location.lat),
      lng: Number(this.mapData.location.lng)
    };

    const mapOptions: google.maps.MapOptions = {
      center: location,
      zoom: 12,
    };

    // Initialize the map
    this.map = new google.maps.Map(this.el.nativeElement.querySelector('#map'), mapOptions);

    // Add the marker
    const marker = new google.maps.Marker({
      position: location,
      map: this.map,
      title: this.mapData.address, // Marker title
      animation: google.maps.Animation.DROP,
    });

    // Create an info window
    this.infoWindow = new google.maps.InfoWindow({
      content: `
      <div class="info-window p-2 max-w-xs bg-white rounded-lg shadow-md">
        <div class="mb-2">
          <img src="${this.mapData?.postMedia}" alt="Image" class="w-full h-32 object-cover rounded-lg">
        </div>
        <h3 class="text-lg font-semibold text-gray-800 mb-2">${this.mapData?.address}</h3>
        <p class="text-gray-600 text-xs">${this.mapData?.caption}</p>
      </div>
      `,
    });
    

    // Add a click event listener to show the info window when the marker is clicked
    marker.addListener('click', () => {
      this.infoWindow.open(this.map, marker);
    });
  }
}
