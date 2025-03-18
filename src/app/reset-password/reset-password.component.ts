import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  password = '';
  message = '';
  token = '';
  error = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    console.log('ResetPasswordComponent initialized');
    this.route.paramMap.subscribe(params => {
      this.token = params.get('token') || '';
      console.log('Token from URL:', this.token);
      if (!this.token) {
        this.error = true;
        this.message = 'Invalid reset token';
        console.error('No token provided in URL');
      }
    });
  }

  onResetPassword() {
    if (!this.password) {
      this.error = true;
      this.message = 'Password is required';
      return;
    }

    if (!this.token) {
      this.error = true;
      this.message = 'Invalid reset token';
      return;
    }

    this.http.post('http://localhost:5000/api/users/reset-password', {
      token: this.token,
      password: this.password,
    }).subscribe({
      next: (response: any) => {
        this.error = false;
        this.message = response.message || 'Password reset successfully';
        setTimeout(() => this.router.navigate(['/login']), 3000);
      },
      error: (error) => {
        this.error = true;
        this.message = error.error.message || 'An error occurred while resetting the password';
      },
    });
  }
}

