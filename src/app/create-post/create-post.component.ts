import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { PostsService } from '../services/posts.service';
import { CommonService } from '../services/common.service';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss'],
})
export class CreatePostComponent implements OnDestroy {
  postForm!: FormGroup;
  mediaPreview: string | null = null;
  isImage: boolean = false;
  isVideo: boolean = false;
  currentPostId: any;
  isUpdate: boolean = false;

  // Subscriptions to handle cleanup
  private subscriptions: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private postService: PostsService,
    private commonService: CommonService
  ) {
    this.postForm = this.fb.group({
      latitude: ['', Validators.required],
      longitude: ['', Validators.required],
      address: ['', Validators.required],
      caption: ['', Validators.required],
      postMedia: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.observeUpdatePostPayload();
    this.observeLoggedInUser();
    if(!this.isUpdate){
      this.postForm.reset();
    }
  }

  // take user fro the local storage 
  observeLoggedInUser(): void {
    const loggedInUserSub = this.commonService.currentLoggedInUserObservable.subscribe(
      (data: any) => {
        console.log('Current Logged In User:', data);
      }
    );
    this.subscriptions.add(loggedInUserSub);
  }

  observeUpdatePostPayload(): void {
    const updatePostSub = this.commonService.updatePostDataObservable.subscribe(
      (data: any) => {
        if (data) {
          this.isUpdate = true;
          const url = data.postMedia;
          const filename = url.split('/').pop();
          console.log('Filename:', filename);

          this.postForm.setValue({
            latitude: data.location.lat,
            longitude: data.location.lng,
            address: data.address,
            caption: data.caption,
            postMedia: filename,
          });

          this.mediaPreview = data.postMedia;
          this.isImage = filename?.match(/\.(jpeg|jpg|png|gif)$/i) ? true : false;
          this.isVideo = filename?.match(/\.(mp4|avi|mov|mkv)$/i) ? true : false;

          this.currentPostId = data._id; // Set the post ID
        }
        console.log('FORM VALUES:', this.postForm.value);
      }
    );
    this.subscriptions.add(updatePostSub);
  }

  get f() {
    return this.postForm.controls;
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      if (file.type.startsWith('image')) {
        this.isImage = true;
        this.isVideo = false;
      } else if (file.type.startsWith('video')) {
        this.isVideo = true;
        this.isImage = false;
      } else {
        alert('Unsupported file type. Please upload an image or video.');
        return;
      }

      reader.onload = () => {
        this.mediaPreview = reader.result as string;
        this.postForm.patchValue({ postMedia: this.mediaPreview });
      };

      reader.readAsDataURL(file);
    }
  }

  removeMedia(): void {
    this.mediaPreview = null;
    this.isImage = false;
    this.isVideo = false;
    this.postForm.patchValue({ postMedia: null });
  }

  useMyLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        this.postForm.patchValue({ latitude: lat, longitude: lng });
      });
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  }

  onSubmit(): void {
    if (this.postForm.invalid) {
      return;
    }

    const formData = this.postForm.value;

    if (this.isUpdate) {
      this.updatePost(formData);
    } else {
      this.createPost(formData);
    }
  }

  createPost(formData: any): void {
    console.log("form Data component : ", formData );
    console.log('type : ', typeof(formData));
    
    this.postService.uploadPost(formData).subscribe(
      (response: any) => {
        console.log('Post created successfully', response);
        this.postForm.reset();
      },
      (error) => {
        console.error('Error creating post:', error);
      }
    );
  }

  updatePost(updateBody: any): void {
    if (this.currentPostId) {
      this.postService.updatePost(this.currentPostId, updateBody).subscribe(
        (response: any) => {
          console.log('Post updated successfully', response);
          this.postForm.reset();
          this.isUpdate = false;
        },
        (error) => {
          console.error('Error updating post:', error);
        }
      );
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    console.log('Subscriptions cleaned up.');
  }
}
