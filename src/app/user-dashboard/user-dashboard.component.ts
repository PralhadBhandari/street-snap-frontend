import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { PostsService } from '../services/posts.service';
import { ProfilesService } from '../services/profiles.service';
import { Router } from '@angular/router';
import { CommonService } from '../services/common.service';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [NgFor, CommonModule],
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss']
})
export class UserDashboardComponent implements OnInit {
  allUsersData: any;
  allProfilesList: any;
  currentUserId: any;
  currentUserData: any;
  postDoneByUser: any;
  loginuserId = sessionStorage.getItem('currentUserLogin');
  menuIndex: number | null = null;
  showDeletePopup = false; // To show/hide the delete confirmation popup
  selectedPostId: number | null = null; // To track the post being deleted
  isProfilePresent : boolean = false;
  showConfirmation = false; // To control the visibility of the confirmation modal


  constructor(
    private authService: AuthService,
    private profileService: ProfilesService,
    private postsService: PostsService,
    private router: Router,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    if (this.loginuserId) {
      const userLoginObject = JSON.parse(this.loginuserId);
      this.currentUserData = userLoginObject;
      this.currentUserId = userLoginObject.id;
    }
    this.getAllUsers();
    this.getAllProfiles();
    this.getAllPosts();
    this.observeUserProfileData();
    
  }

  // getUserDataForm

  observeUserProfileData(){
    this.commonService.editProfileDataObservable.subscribe((data:any) => {
      console.log("PROFILE DATA from the Observable : ", data)
    })
  }

  getAllProfiles() {
    this.profileService.getAllProfiles().subscribe((data: any) => {
      this.allProfilesList = data;
      this.getCurrentUserProfileData();
    });
  }

  getAllPosts() {
    this.postsService.getAllPosts().subscribe((data: any) => {
      console.log("first", data);
      this.postDoneByUser = data.filter(
        (x: any) => x.user._id === this.currentUserId
      );
    });
  }

  getCurrentUserProfileData() {
    const userProfile = this.allProfilesList.find(
      (profile: any) => profile.user._id === this.currentUserId
    );
    if (userProfile) {
      this.currentUserData = userProfile;
      console.log("this.currentUserData :", this.currentUserData)
      this.isProfilePresent = true;
    }
  }

  getAllUsers(): void {
    this.authService.getUsers().subscribe((data: any) => {
      this.allUsersData = data;
    });
  }

  menuOpen = false; // Menu state

  toggleOptionsMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  openDeleteConfirmation(): void {
    this.showConfirmation = true; // Open the confirmation modal
    this.menuOpen = false; // Close the menu when confirmation is triggered
  }

  toggleMenu(index: number): void {
    this.menuIndex = this.menuIndex === index ? null : index;
  }

  confirmDelete(postId: number): void {
    this.showDeletePopup = true;
    this.selectedPostId = postId;
  }

  deletePost(): void {
    console.log("Deleting post with ID:", this.selectedPostId);
    console.log("type", this.selectedPostId);
    console.log("type", Number(this.selectedPostId));


    if (this.selectedPostId) {
      this.postsService.deletePost(this.selectedPostId).subscribe({
        next: () => {
          this.getAllPosts();
          this.closePopup();
          this.menuIndex = null;
        },
        error: (err) => console.error('Error deleting post:', err)
      });
    }
  }

  redirectToPost(){
    this.router.navigate(['create-post'])
  }

  updatePost(post: any): void {
    this.commonService.changeUpdatePostData(post);
    this.router.navigate(['create-post', 'update']);
    this.menuIndex = null;
  }

  closePopup(): void {
    this.showDeletePopup = false;
    this.selectedPostId = null;
  }

  editProfile(userProfilePhoto : any , username: any , bio : any){
    console.log("currentUserData", this.currentUserData)
    console.log("called !!");
    this.router.navigate(['edit-profile', 'update' ]);
    let userProfileId = this.currentUserData._id;
    this.commonService.changeEditProfileData({ userProfilePhoto, username, bio , userProfileId })
  }

  createProfile(){
    this.router.navigate(['edit-profile']);
  }

  deleteProfile(){
    console.log("Delete worksss !!")
    this.showConfirmation = false;
  }

  cancelDelete(){
    console.log("cancelling delete ... ");
    this.showConfirmation = false;

  }
}
