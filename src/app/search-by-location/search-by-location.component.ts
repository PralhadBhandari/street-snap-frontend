import {
  Component,
  ElementRef,
  NgZone,
  OnInit,
  ViewChild,
  AfterViewInit,
  AfterViewChecked,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule } from '@angular/google-maps';
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
  selector: 'app-search-by-location',
  standalone: true,
  imports: [CommonModule, GoogleMapsModule, ReactiveFormsModule],
  templateUrl: './search-by-location.component.html',
  styleUrls: ['./search-by-location.component.scss'],
})
export class SearchByLocationComponent implements OnInit, AfterViewInit, AfterViewChecked {
  @ViewChild('addressInput', { static: false }) addressInput!: ElementRef;
  @ViewChild('map', { static: false }) mapElement!: ElementRef;


  locations: LocationData[] = [];
  map: google.maps.Map | undefined;
  // centerCoordinates = { lat: 17.6139, lng: 73.209 }; // Example center
  radius = 50; // Radius in km

  locationForm!: FormGroup;
  latitude: number | null = null;
  longitude: number | null = null;
  message: string | null = null;
  // map: google.maps.Map | null = null;
  mapInitialized: boolean = false;
  isLoading: boolean = false;

  constructor(private fb: FormBuilder, private ngZone: NgZone , private postsService : PostsService) {
    this.locationForm = this.fb.group({
      lat: new FormControl('', [Validators.required]),
      lng: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.getAllPosts();
  }

  ngAfterViewInit(): void {
    if (this.addressInput && this.addressInput.nativeElement) {
      this.initializeAutocomplete();
    }
  }

  ngAfterViewChecked(): void {
    if (this.mapElement?.nativeElement && !this.mapInitialized && this.latitude && this.longitude) {
      // this.initializeMap(this.mapElement.nativeElement);
      this.initMap(this.latitude, this.longitude);
      this.mapInitialized = true;
    }
  }

  initializeAutocomplete(): void {
    const options: google.maps.places.AutocompleteOptions = {
      fields: ['geometry', 'formatted_address'],
      strictBounds: false,
    };

    const autocomplete = new google.maps.places.Autocomplete(this.addressInput.nativeElement, options);

    autocomplete.addListener('place_changed', () => {
      this.ngZone.run(() => {
        const place = autocomplete.getPlace();
        if (!place.geometry) {
          window.alert(`No details available for input: '${place.name}'`);
          return;
        }

        const lat = place.geometry.location?.lat();
        const lng = place.geometry.location?.lng();

        if (lat && lng) {
          this.locationForm.patchValue({
            lat,
            lng,
            address: place.formatted_address,
          });
          this.latitude = lat;
          this.longitude = lng;
          this.onSubmit(); // Call onSubmit without arguments
        }
      });
    });
  }

  onSubmit(): void {
    console.log('onSubmit triggered');
    this.isLoading = true;

    if (this.mapElement?.nativeElement) {
      const mapContainer = this.mapElement.nativeElement;

      if (this.locationForm.valid) { // Check form validity
        this.latitude = +this.locationForm.get('lat')?.value; // Use + to convert to number
        this.longitude = +this.locationForm.get('lng')?.value;

        if (this.latitude && this.longitude) {
          // this.initializeMap(mapContainer);
          this.initMap(this.latitude, this.longitude);
        } else {
          console.error("Latitude or Longitude is invalid")
        }
      }
      this.isLoading = false;
    } else {
      console.log('Map container not available');
      this.isLoading = false;
    }
  }

  getLocation(): void {
    if (navigator.geolocation) {
      this.isLoading = true;
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          this.locationForm.patchValue({
            lat: this.latitude,
            lng: this.longitude,
          });
          this.onSubmit();
          this.isLoading = false;
        },
        (error) => {
          this.message = 'Unable to retrieve your location.';
          this.isLoading = false;
        }
      );
    } else {
      this.message = 'Geolocation is not supported by this browser.';
      this.isLoading = false;
    }
  }

  // initializeMap(mapContainer: HTMLElement): void {
  //   if (!this.map) {
  //     this.map = new google.maps.Map(mapContainer, {
  //       center: { lat: this.latitude!, lng: this.longitude! },
  //       zoom: 12,
  //     });
  //   } else {
  //     this.map.setCenter({ lat: this.latitude!, lng: this.longitude! });
  //   }
  //   new google.maps.Marker({
  //     position: { lat: this.latitude!, lng: this.longitude! },
  //     map: this.map,
  //     animation: google.maps.Animation.DROP,
  //   });
  // }










  
    getAllPosts(): void {
      this.postsService.getAllPosts().subscribe((data: LocationData[]) => {
        this.locations = data;
        console.log('Fetched locations:', this.locations);
        // this.initMap(); // Initialize the map after fetching the data
      });
    }
  
    initMap(lat : any , lng  : any ): void {
      const mapElement = document.getElementById('map');
      let coordinates = { lat , lng }
      //  = { lat : this.latitude , lng : this.longitude }
      if (!mapElement) {
        console.error('Map element not found');
        return;
      }
  
      // Initialize the map
      this.map = new google.maps.Map(mapElement, {
        zoom: 10,
        center: coordinates,
      });
  
      // Add circle to the map
      new google.maps.Circle({
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35,
        map: this.map,
        center: coordinates,
        radius: this.radius * 1000, // Convert km to meters
      });
  
      // Filter and add markers within the radius
      this.locations.forEach((location) => {
        const distance = this.calculateDistance(
          coordinates.lat,
          coordinates.lng,
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
            <div>
              <h4>${location.user.username}</h4>
              <p>${location.caption}</p>
              <img src="${location.postMedia}" alt="Post Media" style="width:100%; height:auto;" />
              <p><strong>Address:</strong> ${location.address}</p>
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