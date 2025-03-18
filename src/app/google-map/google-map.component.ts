import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, NgZone } from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';

@Component({
  selector: 'app-google-map',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, GoogleMapsModule],
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.scss']
})
export class GoogleMapComponent implements OnInit {
  
  @ViewChild('addressInput', { static: false }) addressInput!: ElementRef;
  mapForm!: FormGroup;
  private map!: google.maps.Map;
  isSearched: boolean = false;

  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef, private ngZone: NgZone) {
    this.mapForm = this.fb.group({
      lat: new FormControl('', [Validators.required]),
      long: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required]),
      image: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initializeAutocomplete();
  }

  initializeAutocomplete(): void {
    const options: google.maps.places.AutocompleteOptions = {
      fields: ['address_components', 'geometry', 'name'],
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
          this.mapForm.patchValue({
            lat,
            long: lng,
            address: this.getAddressComponents(place),
          });
        }
      });
    });
  }

  getAddressComponents(place: google.maps.places.PlaceResult): string {
    let address = '';
    if (place.address_components) {
      for (const component of place.address_components) {
        const componentType = component.types[0];
        switch (componentType) {
          case 'street_number':
            address += component.long_name + ' ';
            break;
          case 'route':
            address += component.long_name + ', ';
            break;
          case 'locality':
            address += component.long_name + ', ';
            break;
          case 'administrative_area_level_1':
            address += component.short_name + ' ';
            break;
          case 'country':
            address += component.long_name;
            break;
        }
      }
    }
    return address;
  }

  displayMarker(): void {
    console.log('Form Data:', this.mapForm.value);
    const { lat, long } = this.mapForm.value;
    this.isSearched = true;

    this.cdr.detectChanges();

    if (this.isGoogleMapsLoaded()) {
      this.initMap(Number(lat), Number(long));
    } else {
      console.error('Google Maps API not loaded. Please ensure the script is included.');
    }
  }

  private isGoogleMapsLoaded(): boolean {
    return typeof google !== 'undefined' && typeof google.maps !== 'undefined';
  }

  private initMap(lat: number, long: number): void {
    const location = { lat, lng: long };

    this.map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
      center: location,
      zoom: 20,
    });

    this.addMarker(location, this.mapForm.value.address, 'A custom description');
  }

  private addMarker(position: google.maps.LatLngLiteral, title: string, description: string): void {
    const marker = new google.maps.Marker({
      position,
      map: this.map,
      title,
    });

    const infoWindowContent = `
      <div class="info-window">
        <img src="${this.mapForm.value.image}" alt="Image">
        <h3>${title}</h3>
        <p>${description}</p>
      </div>
    `;

    const infoWindow = new google.maps.InfoWindow({
      content: infoWindowContent,
    });

    marker.addListener('click', () => {
      infoWindow.open(this.map, marker);
    });
  }
    
}