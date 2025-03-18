import { HttpClient } from '@angular/common/http';
import { inject, Inject, Injectable } from '@angular/core';
import { LoginUser, User } from '../models/User.model';
import { BehaviorSubject, catchError, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router = inject(Router);

  private isUserLoggedIn = new BehaviorSubject<boolean>(false);
  isUserLoggedInObserve = this.isUserLoggedIn.asObservable();

  changeIsUserLoggedIn(data : any){
    this.isUserLoggedIn.next(data);
  }

  baseUrl : string = "http://localhost:5000/api/users"
  constructor(private http : HttpClient) { }

  getUsers(): Observable<User[]>{
    console.log("called")
    return this.http.get<User[]>(this.baseUrl);
  }

  registerUser(user : User) : Observable<User>{
    return this.http.post<User>(`${this.baseUrl}/register`, user);
  }

  loginUser(user: LoginUser): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.baseUrl}/login`, user);
    // .pipe(
    //   tap((response) => {
    //     sessionStorage.setItem('token', response.token);
    //     this.isUserLoggedIn.next(true);
    //   }),
    //   catchError((error: any) => {
    //     console.error('Login failed:', error);
    //     throw new Error('Invalid credentials.');
    //   })
    // );
  }

  logout(): void {
    sessionStorage.removeItem('StreetSnapAuthorizationToken');
    sessionStorage.removeItem('currentUserLogin');
    this.isUserLoggedIn.next(false);
    this.router.navigate(['/login']);
  }
}
