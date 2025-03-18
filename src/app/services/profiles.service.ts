import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProfilesService {

  baseUrl : string = "http://localhost:5000/api/profiles"
  constructor(private http : HttpClient) { }
  
  getAllProfiles(){
    return this.http.get<any>(this.baseUrl)
  }

  createProfile(body : any ){
    return this.http.post(this.baseUrl, body);
  }

  updateProfile(id : any , body : any ){
    return this.http.put(`${this.baseUrl}/${id}`, body);
  }
  deleteProfile(id: any ){
    return this.http.delete(`${this.baseUrl}/${id}`)
  }
}
