import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { LoginUser } from '../../../models/User.model';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-login-user',
  standalone: true,
  imports: [CommonModule,FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login-user.component.html',
  styleUrl: './login-user.component.scss'
})
export class LoginUserComponent {
  loginForm! : FormGroup;
  token : string = "";
  invalidCredentials: boolean = false;

  constructor( 
    private fb : FormBuilder, 
    private auth_service : AuthService , 
    private router : Router,
    private common_service: CommonService
  ){
    this.loginForm = this.fb.group({
      email : new FormControl('', [Validators.required]),
      password : new FormControl('', [Validators.required, Validators.minLength(6)])
    })
  }
  

  onSubmit() {
    console.log(this.loginForm.value);
    let user = this.loginForm.value;
  
    this.auth_service.loginUser(user).subscribe(
      (data: any) => {
        console.log("data", data);
        if (data && data.token) {
          this.token = data.token;
  
          let decryptedToken = JSON.parse(atob(data.token.split('.')[1]));
          sessionStorage.setItem("StreetSnapAuthorizationToken", data.token);
          sessionStorage.setItem("currentUserLogin", JSON.stringify(decryptedToken));
  
          this.common_service.changeCurrentLoggedInUser(decryptedToken);
          this.router.navigate(['/']); // Navigate to base route
        }
      },
      (error: any) => {
        console.error("Login error:", error);
        if (error.status === 401) {
          this.invalidCredentials = true;
          sessionStorage.removeItem('StreetSnapAuthorizationToken');
        } else {
          alert("An error occurred. Please try again later.");
        }
      }
    );
  }
  
  // onSubmit() {
  //   console.log(this.loginForm.value);
  //   let user = this.loginForm.value;
  
  //   this.auth_service.loginUser(user).subscribe(
  //     (data: any) => {
  //       console.log("data", data);
  //       // If the data contains a StreetSnapAuthorizationToken, save it in sessionStorage
  //       if (data && data.token) {
  //         this.token = data.token;

  //         let decryptedToken = JSON.parse(atob(data.token.split('.')[1]));
          
  //         sessionStorage.setItem("StreetSnapAuthorizationToken", data.token);
  //         sessionStorage.setItem("currentUserLogin", JSON.stringify(decryptedToken));


  //         this.common_service.changeCurrentLoggedInUser(decryptedToken);
  //         this.router.navigate(['/home']); 
  //       }
  //     },
  //     (error: any) => {
  //       // Handle errors (e.g., incorrect credentials)
  //       console.error("Login error:", error);
  //       if (error.status === 401) {
  //         // Show error message if credentials are incorrect
  //         this.invalidCredentials = true;  // This flag will be used to display the error message
  //         sessionStorage.removeItem('StreetSnapAuthorizationToken')
  //       } else {
  //         // Handle other types of errors
  //         alert("An error occurred. Please try again later.");
  //       }
  //     }
  //   );
  // }
  
  
}
