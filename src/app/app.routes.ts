import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RegisterUserComponent } from './modules/user/register-user/register-user.component';
import { LoginUserComponent } from './modules/user/login-user/login-user.component';
import { GoogleMapComponent } from './google-map/google-map.component';
import { GenerateMapComponent } from './generate-map/generate-map.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { SearchByLocationComponent } from './search-by-location/search-by-location.component';
import { SearchByPostComponent } from './search-by-post/search-by-post.component';
import { authGuard } from './auth.guard';
import { CreatePostNewComponent } from './create-post-new/create-post-new.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { ExploreFeedComponent } from './explore-feed/explore-feed.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

export const routes: Routes = [
  // Public routes
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password/:token', component: ResetPasswordComponent },
  // { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'login', component: LoginUserComponent },
  { path: 'register', component: RegisterUserComponent },

  // Protected routes (requires authGuard)
  {
    path: '',
    component: HomeComponent,
    canActivate: [authGuard], // Only apply the guard to this section
    children: [
      { path: '', redirectTo: 'explore-feed', pathMatch: 'full' },
      { path: 'explore-feed', component: ExploreFeedComponent },
      { path: 'dashboard', component: UserDashboardComponent },
      { path: 'google-map', component: GoogleMapComponent },
      { path: 'generate-map', component: GenerateMapComponent },
      { path: 'edit-profile/:id', component: EditProfileComponent },
      { path: 'edit-profile', component: EditProfileComponent },
      { path: 'create-post', component: CreatePostNewComponent },
      { path: 'create-post/:id', component: CreatePostNewComponent },
      { path: 'search-by-location', component: SearchByLocationComponent },
      { path: 'search-by-post', component: SearchByPostComponent },
    ],
  },

  // Wildcard route for undefined paths
  { path: '**', redirectTo: 'login', pathMatch: 'full' },
];
