import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/User.model';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './register-user.component.html',
  styleUrl: './register-user.component.scss'
})
export class RegisterUserComponent {
  userList : User[] = [];
  registerForm : FormGroup ;
  constructor(private auth_service : AuthService, private fb : FormBuilder){
    this.registerForm = this.fb.group({
      username : new FormControl("",[Validators.required, Validators.minLength(2)]),
      email : new FormControl("",[Validators.required]),
      password : new FormControl("",[Validators.required, Validators.minLength(6)]),
    })
  }
  
  ngOnInit(){
    // this.getAllUsers();
  }

  // getAllUsers(){
  //   this.auth_service.getUsers().subscribe((data : any) => {
  //     this.userList = data;
  //     console.log(data)
  //   })
  // }

  createUser(){
    let user = this.registerForm.value;
    console.log("this.registerForm.value", user)
    this.auth_service.registerUser(user).subscribe((data: any) => {
      // this.getAllUsers();
      console.log("User Registered Successfully !!")
    })
  }

  onSubmit(){
    console.log(this.registerForm.value);
    this.createUser();
  }

}
