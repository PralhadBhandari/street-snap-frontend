import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  private http = inject(HttpClient);
  baseUrl = "http://localhost:5000/api/comments";
  constructor() { }

  getAllComments(){
    return this.http.get(this.baseUrl);
  }

  getCommentById(id : any ){
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  postComment(body : any ){
    return this.http.post(this.baseUrl, body);
  }

  updateComment(id: any , body : any ){
    return this.http.put(`${this.baseUrl}/${id}`, body);
  }

  deleteComment(id : any){
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

}
