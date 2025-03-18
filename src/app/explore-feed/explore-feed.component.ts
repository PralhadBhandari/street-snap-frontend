import { Component, HostListener, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PostsService } from '../services/posts.service';
import { ProfilesService } from '../services/profiles.service';
import { Router } from '@angular/router';
import { CommonService } from '../services/common.service';
import { forkJoin } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommentsService } from '../services/comments.service';
import { CommonModule } from '@angular/common';
import { RepliesService } from '../services/replies.service';

@Component({
  selector: 'app-explore-feed',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './explore-feed.component.html',
  styleUrls: ['./explore-feed.component.scss'],
})
export class ExploreFeedComponent implements OnInit {
  @ViewChild('commentSection', { static: false }) commentSection: ElementRef | undefined;
  
  postsList: any[] = [];
  profilesList: any[] = [];
  mergedPosts: any[] = [];
  commentInput: string = '';
  loggedInUser : any ;
  loggedInUserId: any;
  isUpdateComment : boolean = false;
  isUpdateReply : boolean = false ;
  commentId : any ;
  replyId : any;
  replyInput :any = '';

  constructor(
    private postsService: PostsService,
    private profilesService: ProfilesService,
    private router: Router,
    private commonService: CommonService,
    private elementRef: ElementRef,
    private commentService: CommentsService,
    private reply_service : RepliesService
  ) {}

  ngOnInit() {
    this.loadData();
    this.getCurrentUser();
  }

  getCurrentUser() {
    const currentUser = sessionStorage.getItem('currentUserLogin');
    const userObject = JSON.parse(`${currentUser}`);
    this.loggedInUser = userObject;
    this.loggedInUserId = userObject.id;
  }

  toggleComment(post: any) {
    this.mergedPosts.forEach((p) => {
      if (p !== post) p.showComments = false;
    });
    post.showComments = !post.showComments;
  }

  closeComments(post: any) {
    post.showComments = false;
  }

  toggleCommentOptions(post: any, commentIndex: number) {
    console.log("toggleCommentOptions called");
    this.mergedPosts.forEach((p) =>
      p.comments.forEach((c: any) => {
        c.showOptions = c === post.comments[commentIndex] ? !c.showOptions : false;
      })
    );
  }

  // Method to toggle reply options visibility
toggleReplyOptions(comment: any, replyIndex: number): void {
  comment.replies.forEach((reply: any, index: number) => {
    reply.showOptions = index === replyIndex ? !reply.showOptions : false;
  });
}

// Method to update a reply
updateReply(comment: any, reply: any): void {
  this.isUpdateReply = true;
  this.replyId = reply._id;
  console.log('Update reply:', reply);
  this.cancelReplyOptions(reply);
  this.replyInput = reply.text;
}

// Method to delete a reply
deleteReply(comment: any, reply: any): void {
  console.log("delete clicked ....")
  this.replyId = reply._id

  console.log('Delete comment:', reply);
  this.reply_service.deleteReply(reply._id).subscribe((data: any ) => {
    console.log("Reply deleted successfully .... ");
    this.loadData();
  })

  this.cancelReplyOptions(reply);

}

addReply(post: any, comment: any) {
  console.log(comment._id);
  console.log(this.loggedInUserId)
  console.log(this.replyInput)

  let replyObj = {
    text : this.replyInput,
    user:this.loggedInUserId,
    comment: comment._id
  }
  console.log("replyObject", replyObj)

  if(this.isUpdateReply){
    // update comments 
    this.reply_service.updateReply(this.replyId,replyObj).subscribe((data:any) => {
      console.log("data : ", data);
      this.isUpdateReply = false;
      this.loadData();
    })

  }
  else{
    // upload comment
    this.reply_service.postReply(replyObj).subscribe((data:any) => {
      console.log("data : ", data);
      this.replyInput = '';
      console.log("Reply added successfully !!")
      this.loadData()
    });
  }

}

  loadData() {
    forkJoin([this.postsService.getAllPosts(), this.profilesService.getAllProfiles()]).subscribe(
      ([posts, profiles]) => {
        this.postsList = posts || [];
        this.profilesList = profiles || [];
        this.mergedPosts = this.mergePostsWithProfiles();
        console.log("this.mergedPosts : ", this.mergedPosts)
      }
    );
  }

  mergePostsWithProfiles(): any[] {
    return this.postsList.map((post) => {
      const profile = this.profilesList.find(
        (profile) => profile?.user?._id === post?.user?._id
      );
      return {
        ...post,
        userProfilePhoto: profile?.userProfilePhoto || 'https://via.placeholder.com/150',
        postMedia: post?.postMedia || 'https://via.placeholder.com/150',
        username: profile?.username || 'Unknown User', // Adding the username
      };
    });
  }

  
  toggleLike(post: any) {
    this.postsService.toggleLike(post._id).subscribe({
      next: (response: any) => {
        console.log(response.message);
        this.loadData(); // Refresh the post list to update like count
      },
      error: (err: any) => {
        console.error('Error toggling like:', err);
      },
      complete: () => {
        console.log('Like toggle operation completed.');
      }
    });
    
  }
  


  postComment(postId: any) {

    const commentObject = {
      text: this.commentInput,
      user: this.loggedInUserId,
      post: postId,
    };
    if(this.isUpdateComment){
      // update comments 
      this.commentService.updateComment(this.commentId,commentObject).subscribe((data:any) => {
        console.log("data : ", data);
        this.isUpdateComment = false;
        this.loadData();
      })

    }
    else{
      // upload comment
      this.commentService.postComment(commentObject).subscribe(() => {
        this.commentInput = '';
        this.loadData();
      });
    }
  }

  toggleReplyBox(post: any, comment: any) {
    comment.isReplying = !comment.isReplying;
  }
  
  sendDataToMap(post: any) {
    console.log('Sending data from ExploreFeedComponent to the Map-Component...');
    this.commonService.changeCurrentPostData(post);
    this.router.navigate(['generate-map']);
  }
    
  cancelCommentOptions(comment: any) {
    // Hide the comment options for the clicked comment
    console.log("called");
    comment.showOptions = false;
  }

      
  cancelReplyOptions(reply: any) {
    // Hide the comment options for the clicked comment
    console.log("called");
    reply.showOptions = false;
  }

  updateComment(post: any, comment: any) {
    this.commentId = comment._id;
    this.isUpdateComment = true;
    console.log('Update comment:', comment);
    this.cancelCommentOptions(comment);
    this.commentInput = comment.text;
    // Implement update logic
  }

  deleteComment(post: any, comment: any) {
    console.log('Delete comment:', comment);
    this.commentService.deleteComment(comment._id).subscribe((data: any ) => {
      console.log("Comment deleted successfully .... ");
      this.loadData();
    })

    this.cancelCommentOptions(comment);

    // Implement delete logic
  }

  generateMap(post: any) {
    console.log("Sending data from about to the Map-Component ..");
    this.commonService.changeCurrentPostData(post);
    this.router.navigate(['generate-map']);
  }
  
}
