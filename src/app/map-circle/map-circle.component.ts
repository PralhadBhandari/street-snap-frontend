import { Component, OnInit } from '@angular/core';
import { PostsService } from '../services/posts.service';

export interface LocationData {
  _id: string;
  user: {
    _id: string;
    username: string;
    email: string;
  };
  postMedia: string;
  caption: string;
  address: string;
  location: {
    lat: number;
    lng: number;
    _id: string;
  };
  comments: string[];
  likes: string[];
  uploadedDate: string;
  expiryDate: string;
  __v: number;
}

@Component({
  selector: 'app-map-circle',
  standalone: true,
  imports: [],
  templateUrl: './map-circle.component.html',
  styleUrls: ['./map-circle.component.scss'],
})
export class MapCircleComponent implements OnInit {
  locations: LocationData[] = [];
  map: google.maps.Map | undefined;
  centerCoordinates = { lat: 17.6139, lng: 73.209 }; // Example center
  radius = 50; // Radius in km

  constructor(private postsService: PostsService) {}

  ngOnInit(): void {
    this.getAllPosts();
  }

  getAllPosts(): void {
    this.postsService.getAllPosts().subscribe((data: LocationData[]) => {
      this.locations = data;
      console.log('Fetched locations:', this.locations);
      this.initMap(); // Initialize the map after fetching the data
    });
  }

  initMap(): void {
    const mapElement = document.getElementById('map');
    if (!mapElement) {
      console.error('Map element not found');
      return;
    }

    // Initialize the map
    this.map = new google.maps.Map(mapElement, {
      zoom: 10,
      center: this.centerCoordinates,
    });

    // Add circle to the map
    new google.maps.Circle({
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      map: this.map,
      center: this.centerCoordinates,
      radius: this.radius * 1000, // Convert km to meters
    });

    // Filter and add markers within the radius
    this.locations.forEach((location) => {
      const distance = this.calculateDistance(
        this.centerCoordinates.lat,
        this.centerCoordinates.lng,
        location.location.lat,
        location.location.lng
      );

      if (distance <= this.radius) {
        const marker = new google.maps.Marker({
          position: { lat: location.location.lat, lng: location.location.lng },
          map: this.map,
          title: location.caption,
        });

// Add info window for each marker
const infoWindowContent = `
  <div style="font-family: Arial, sans-serif; width: 300px; height: 400px; padding: 10px; color: #333; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); display: flex; flex-direction: column; justify-content: space-between;">
    <div>
      <h4 style="font-size: 1.2rem; font-weight: bold; color: #4CAF50; margin-bottom: 8px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${location.user.username}</h4>
      <p style="font-size: 0.9rem; color: #555; margin-bottom: 10px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${location.caption}</p>
    </div>
    <div style="flex-grow: 1; margin-bottom: 10px;">
      <img 
        src="${location.postMedia}" 
        alt="Post Media" 
        style="width: 100%; height: 200px; border-radius: 6px; object-fit: cover; display: block;" 
      />
    </div>
    <div>
      <p style="font-size: 0.9rem; margin-bottom: 5px;"><strong>Address:</strong> ${location.address}</p>
    </div>
  </div>
`;




        const infoWindow = new google.maps.InfoWindow({
          content: infoWindowContent,
        });

        marker.addListener('click', () => {
          infoWindow.open(this.map, marker);
        });
      }
    });
  }

  calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Radius of the Earth in km
    const dLat = this.degreesToRadians(lat2 - lat1);
    const dLng = this.degreesToRadians(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.degreesToRadians(lat1)) *
        Math.cos(this.degreesToRadians(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  }

  degreesToRadians(degrees: number): number {
    return (degrees * Math.PI) / 180;
  }
}
