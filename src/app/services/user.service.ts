import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseData } from '../models/ResponseData';
import { IUserModel } from '../models/UserModel';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {
  }

  getUserList(): Observable<ResponseData<IUserModel[]>> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get(`${environment.rootUrl}/User/GetAllUserDetails`, { headers: reqHeader });
  }

  getUserById(user_id?: string): Observable<ResponseData<IUserModel>> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get(`${environment.rootUrl}/User/GetUserDetails?UserId=${user_id}`, { headers: reqHeader });
  }

  saveUserData(req: IUserModel): Observable<ResponseData<IUserModel>> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': "*"
    });

    return this.http.post(`${environment.rootUrl}/User/InsertUpdateUser`, req, {
      headers: reqHeader,
    });
  }

  deleteUserData(serial?: number): Observable<ResponseData<string>> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': "*"
    });

    return this.http.post(`${environment.rootUrl}/User/DeleteUser?serial=${serial}`, {
      headers: reqHeader,
    });
  }
}
