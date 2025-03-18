import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RepliesService {
  private http = inject(HttpClient);
  baseUrl :string = "http://localhost:5000/api/replies";
  constructor() { }

  postReply(body : any ){
    return this.http.post(this.baseUrl, body);
  }

  updateReply(id : any ,body : any ){
    return this.http.put(`${this.baseUrl}/${id}`, body);
  }
  
  deleteReply(id: any  ){
    return this.http.delete(`${this.baseUrl}/${id}`);
  }


}
