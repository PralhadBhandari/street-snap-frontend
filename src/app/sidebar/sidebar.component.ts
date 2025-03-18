import { CommonModule } from '@angular/common';
import { Component, HostListener, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports : [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  @Input() isSidebarOpen: boolean = false; // Accepts value from parent component
  isLargeScreen: boolean = window.innerWidth >= 1024;

  constructor(private auth_service : AuthService ) {}

  // Toggle sidebar on small screens
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  // Close sidebar when a menu item is clicked (only for mobile)
  onMobileItemClick() {
    if (!this.isLargeScreen) {
      this.isSidebarOpen = false;
    }
  }

  // Update `isLargeScreen` when the window is resized
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.isLargeScreen = (event.target as Window).innerWidth >= 1024;
    if (this.isLargeScreen) {
      this.isSidebarOpen = false; // Keep it open on large screens
    }
  }

  logout(): void {
    // Implement your logout logic here
    this.auth_service.logout();
    this.toggleSidebar(); // Close sidebar after logout on mobile
  }
}
