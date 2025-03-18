import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PostsService } from '../services/posts.service';
import { CommonModule } from '@angular/common';
import { CommonService } from '../services/common.service';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-search-by-post',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './search-by-post.component.html',
  styleUrls: ['./search-by-post.component.scss']
})
export class SearchByPostComponent implements OnInit {
  searchForm!: FormGroup;
  posts = [];
  filteredPosts: any[] = [];

  constructor(
    private fb: FormBuilder, 
    private postService: PostsService, 
    private common_service: CommonService, 
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.getAllPosts(); // Ensure posts are fetched during initialization
  }

  getAllPosts() {
    this.postService.getAllPosts().subscribe((data: any) => {
      this.posts = data;
      console.log("THIS.POSTS", this.posts);
      this.filteredPosts = [...this.posts]; // Initialize filtered posts with all posts after fetching
      this.setupValueChanges(); // Set up value changes after posts are fetched
    });
  }

  // Initialize Reactive Form
  private initForm() {
    this.searchForm = this.fb.group({
      searchTerm: [''], // Input field for search term
      selectedFilter: [''], // Dropdown for filter selection
    });
  }

  // Handle value changes for form fields
  private setupValueChanges() {
    this.searchForm.valueChanges.subscribe((formValues) => {
      console.log("Form values changed:", formValues); // Log when form values change
      this.filterPosts(formValues.selectedFilter, formValues.searchTerm);
    });
  }

  // Updated Filter Logic
  private filterPosts(filter: string, searchTerm: string) {
    if (!searchTerm) {
      this.filteredPosts = [...this.posts]; // If no search term, show all posts
      return;
    }
    this.filteredPosts = this.posts.filter((post : any ) => {
      if (filter === 'username') {
        return post?.user?.username?.toLowerCase().includes(searchTerm.toLowerCase());
      } else if (filter === 'address') {
        return post.address?.toLowerCase().includes(searchTerm.toLowerCase());
      } else if (filter === 'caption') {
        return post.caption?.toLowerCase().includes(searchTerm.toLowerCase());
      }
      return false; 
    });
  }

  generateMap(post: any) {
    console.log("Sending data from about to the Map-Component ..");
    this.common_service.changeCurrentPostData(post);
    this.router.navigate(['generate-map']);
  }
}
