import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  // private currentLoggedInUser = new BehaviorSubject<any>(null);
  // currentLoggedInUserObservable = this.currentLoggedInUser.asObservable();
  
  private currentLoggedInUser = new BehaviorSubject<any>(null);
  currentLoggedInUserObservable = this.currentLoggedInUser.asObservable(); 

  private currentPostData = new BehaviorSubject<any>('');
  currentPostDataObservable = this.currentPostData.asObservable();

  private updatePostData = new BehaviorSubject<any>('');
  updatePostDataObservable = this.updatePostData.asObservable();

  private editProfileData = new BehaviorSubject<any>('');
  editProfileDataObservable = this.editProfileData.asObservable();

  constructor() { }

  changeCurrentLoggedInUser(data : any ){
    this.currentLoggedInUser.next(data);
  }

  changeCurrentPostData(data : any ){
    this.currentPostData.next(data);
  }
  changeUpdatePostData(data:any){
    this.updatePostData.next(data);
  }
  changeEditProfileData(data : any ){
    this.editProfileData.next(data);
  }

}
