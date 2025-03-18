import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  email = '';
  message = '';

  constructor(private http: HttpClient) {}
  
  onForgotPassword() {
    this.http.post('http://localhost:5000/api/users/forgot-password', { email: this.email })
      .subscribe({
        next: (response: any) => this.message = response.message,
        error: (error) => this.message = error.error.message
      });
  }
}
