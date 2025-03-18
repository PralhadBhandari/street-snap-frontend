import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RegisterUserComponent } from "./modules/user/register-user/register-user.component";
import { HomeComponent } from './home/home.component';
import { MapCircleComponent } from "./map-circle/map-circle.component";
import { ExploreFeedComponent } from "./explore-feed/explore-feed.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  constructor(private router: Router) {}

  ngOnInit(): void {
    // Redirect to the 'explore' (about) page after login or when landing on the home page.
    // this.router.navigate(['/explore-feed']);
  }

}
