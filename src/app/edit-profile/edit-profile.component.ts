import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonService } from '../services/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfilesService } from '../services/profiles.service';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent {
  profileImageUrl: string | ArrayBuffer | null = null; // Profile image URL or data URI
  userProfileForm!: FormGroup;
  isUpdate: boolean = false;
  userProfileId : any;

  constructor(private fb: FormBuilder, private common_service: CommonService,
    private route :ActivatedRoute,
    private profile_service : ProfilesService,
    private router : Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();

    // Initialize the form with validation
    this.route.paramMap.subscribe(params => {
      console.log('User ID:', params.get('id'));
      if(params.get('id') != null){
        this.observeEditData();
        this.isUpdate = true;
      }
    });

  }

  initializeForm(): void {
    // Create or reset the form
    this.userProfileForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]], // Username field with validation
      bio: ['', [Validators.required, Validators.maxLength(200)]], // Bio field with validation
      userProfilePhoto: [null, Validators.required], // User profile photo field (File input)
    });

    this.profileImageUrl = null; // Clear profile image preview
  }

  observeEditData(): void {
    this.common_service.editProfileDataObservable.subscribe((data: any) => {
      if (data) {
        this.userProfileForm.patchValue(data); // Populate the form with existing data
        this.profileImageUrl = data.userProfilePhoto;
        this.userProfileId = data.userProfileId
      }
    });
  }

  // Getter for easy access to form controls
  get f() {
    return this.userProfileForm.controls;
  }

  // Submit the form
  onSubmit(): void {
    console.log('formmm : ', this.userProfileForm.value)
    if (this.userProfileForm.valid) {
      console.log('Form submitted:', this.userProfileForm.value);
      if(this.isUpdate){
        // console.log("UPDATE Successful");
        // apply logic to UPDATE the profile here 
        console.log("ID update :", this.userProfileId)
        this.profile_service.updateProfile(this.userProfileId, this.userProfileForm.value).subscribe((data: any) => {
          console.log("response : ", data)
        })

        this.userProfileForm.reset(); 
        this.profileImageUrl = null;
        this.isUpdate = false;
        this.router.navigate(['dashboard'])
      }
      else{
        // apply logic to ADD the profile here 

        console.log("this.userProfileForm.value :", this.userProfileForm.value);
        let userId = sessionStorage.getItem('currentUserLogin');
        let jsonString = `${userId}`;
        let parsedJsonStringId = JSON.parse(jsonString).id;

        // let profileObj = {
        //   ... this.userProfileForm.value,
        //   user : parsedJsonStringId, 
        // }
        let profileObj = {
          user : parsedJsonStringId, 
          bio: this.userProfileForm.value.bio ,
          username : this.userProfileForm.value.username,
          userProfilePhoto :  this.userProfileForm.value.userProfilePhoto
        }

        console.log("Profile Object :", profileObj)

        this.profile_service.createProfile(profileObj).subscribe((data : any )  => {
          console.log("response from the BACKEND API : : ", data)
          this.common_service.changeEditProfileData(data);
        })

        this.userProfileForm.reset();
        this.router.navigate(['dashboard'])

      }
    } else {
      console.log('Form is not valid');
    }
  }

  // File change event handler to preview the selected image
  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Generate a URL for the selected file (image preview)
      const reader = new FileReader();
      reader.onload = () => {
        this.profileImageUrl = reader.result; // Set the image preview
        console.log("PHOTO URL :", this.profileImageUrl );
        this.userProfileForm.get('userProfilePhoto')?.setValue(this.profileImageUrl);

      };
      reader.readAsDataURL(file); // Read the file as a data URL
    }
  }

  ngOnDestroy(): void {
    console.log('EditProfileComponent destroyed');
    this.userProfileForm.reset(); // Reset the form on component destruction
    this.profileImageUrl = null; // Clear the image preview
    this.isUpdate = false ;
  }
}
