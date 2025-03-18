import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LocationData } from '../map-circle/map-circle.component';

@Injectable({
  providedIn: 'root'
})

export class PostsService {
  baseUrl : string = 'http://localhost:5000/api/posts';

  constructor( private http : HttpClient) { }


  getAllPosts(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  uploadPost(postData: any ): Observable<any> {
    console.log("postData Service : ", postData)
    return this.http.post(this.baseUrl, postData);
  }

  updatePost( id : any , updateData : any ){
    return this.http.put(`${this.baseUrl}/${id}` ,updateData );
  }
  
  deletePost( id : any ){
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  toggleLike(postId: string) {
    return this.http.patch(`${this.baseUrl}/${postId}/like`, {});
  }
  
  
}
