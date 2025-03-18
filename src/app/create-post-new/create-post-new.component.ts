import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CommonService } from '../services/common.service';
import { PostsService } from '../services/posts.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-create-post-new',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './create-post-new.component.html',
  styleUrl: './create-post-new.component.scss'
})
export class CreatePostNewComponent implements OnInit, OnDestroy {
  postForm!: FormGroup;
  mediaPreview: string | null = null;
  isImage: boolean = false;
  isVideo: boolean = false;
  currentPostId: any;
  updateFlag: boolean = false;
  loggedInUser: any;
  private subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private postService: PostsService,
    private commonService: CommonService,
    private route: ActivatedRoute,
    private router: Router
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
    this.subscriptions.push(
      this.route.paramMap.subscribe((params: any) => {
        if (params.get('id') != null) {
          this.updateFlag = true;
        }
      })
    );

    if (!this.updateFlag) {
      this.commonService.changeUpdatePostData(null);
      this.postForm.reset();
    }

    this.observeUpdatePostPayload();
    this.observeLoggedInUser();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  observeLoggedInUser(): void {
    this.subscriptions.push(
      this.commonService.currentLoggedInUserObservable.subscribe(
        (data: any) => {
          this.loggedInUser = data;
          console.log('this.loggedInUser ', this.loggedInUser);
        }
      )
    );
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
        this.postForm.patchValue({ postMedia: file });
      };

      reader.readAsDataURL(file);
    }
    console.log("Post Form Value:", this.postForm.value);
  }

  removeMedia(): void {
    this.mediaPreview = null;
    this.isImage = false;
    this.isVideo = false;
    this.postForm.patchValue({ postMedia: null });
    console.log("Media removed.");
  }

  observeUpdatePostPayload(): void {
    this.subscriptions.push(
      this.commonService.updatePostDataObservable.subscribe(
        (data: any) => {
          if (data) {
            this.updateFlag = true;
            const url = data.postMedia;
            const filename = url.split('/').pop();
            console.log('Filename:', filename);

            this.mediaPreview = url; // Set the mediaPreview to the URL
            this.isImage = filename?.match(/\.(jpeg|jpg|png|gif)$/i) ? true : false;
            this.isVideo = filename?.match(/\.(mp4|avi|mov|mkv)$/i) ? true : false;

            this.postForm.patchValue({
              latitude: data.location.lat,
              longitude: data.location.lng,
              address: data.address,
              caption: data.caption,
              postMedia: url,
            });

            this.currentPostId = data._id;
          }
          console.log('FORM VALUES:', this.postForm.value);
        }
      )
    );
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

    if (this.updateFlag) {
      this.updatePost(formData);
    } else {
      this.createPost(formData);
    }
  }

  createPost(formData: any): void {
    console.log("Form Data component:", formData);
    let postObj = {
      user: this.loggedInUser.id,
      postMedia: this.mediaPreview,
      caption: this.postForm.value.caption,
      address: this.postForm.value.address,
      location: {
        lat: this.postForm.value.latitude,
        lng: this.postForm.value.longitude
      }
    }
    console.log("postObj", postObj)

    this.postService.uploadPost(postObj).subscribe({
      next: (response: any) => {
        console.log('Post created successfully', response);
        this.postForm.reset();
        this.router.navigate(['dashboard']);
      },
      error: (error: any) => {
        console.error('Error creating post:', error);
      },
      complete: () => {
        console.log('Post creation process completed.');
      }
    });
  }

  updatePost(updateBody: any): void {
    console.log("Form Data component:", updateBody);
    console.log("this.currentPostId : ", this.currentPostId)
    let postObj = {
      user: this.loggedInUser.id,
      postMedia: this.mediaPreview,
      caption: this.postForm.value.caption,
      address: this.postForm.value.address,
      location: {
        lat: this.postForm.value.latitude,
        lng: this.postForm.value.longitude
      }
    }
    console.log("postObj", postObj)

    if (this.currentPostId) {
      this.postService.updatePost(this.currentPostId, postObj).subscribe({
        next: (response: any) => {
          console.log('Post updated successfully', response);
          this.postForm.reset();
          this.updateFlag = false;
          this.router.navigate(['dashboard']);
        },
        error: (error: any) => {
          console.error('Error updating post:', error);
        },
        complete: () => {
          console.log('Post update process completed.');
        },
      });
    }
  }
}

