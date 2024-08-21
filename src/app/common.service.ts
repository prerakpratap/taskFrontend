import { formatDate } from '@angular/common';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

const httpOtions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
@Injectable({
  providedIn: 'root',
})
export class CommonService {
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }

    return throwError('Something bad happened; please try again later.');
  }

  private extractData(res: any) {
    let body = res;
    return body || {};
  }

  constructor(private http: HttpClient, private router: Router) {}

  loginUser(data: { email: any; password: any }): Observable<any> {
    return this.http.post(`${environment.apiUrl}/login`, data, httpOtions);
  }
  signup(data: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/signup`, data, httpOtions);
  }

  getTaskData(id: any): Observable<any> {
    return this.http
      .get(`${environment.apiUrl}/getTask`, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'x-access-token': JSON.parse(localStorage.getItem('token') || ''),
          user_id: id,
        }),
      })
      .pipe(map(this.extractData), catchError(this.handleError));
  }

  updateTask(data: any, id: any): Observable<any> {
    return this.http.put(`${environment.apiUrl}/updateTask/${id}`, data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': JSON.parse(localStorage.getItem('token') || ''),
        user_id: id,
      }),
    });
  }

  createTask(data: any, id: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/addTask`, data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': JSON.parse(localStorage.getItem('token') || ''),
        user_id: id,
      }),
    });
  }

  deleteTask(task_id: any, id: any): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/deleteTask/${task_id}`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': JSON.parse(localStorage.getItem('token') || ''),
        user_id: id,
      }),
    });
  }

  displaySwal(message: any, title: any, type: any, okBtn = 'ok') {
    const date = new Date();
    const currentTime = formatDate(date, 'dd/MM/yyyy, hh:mm a', 'en');
    return Swal.fire({
      icon: type,
      title: title,
      html: `<h5>${message}</h5><h6 style= "color:#59178a; font-weight: 700;"></h6><h6 style="color: #e60094; font-weight: 700;">${currentTime}</h6>`,
      text: 'Something went wrong!',
      showClass: {
        popup: 'animate__animated animate__fadeInDown',
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp',
      },
      // footer: '<a href="">Why do I have this issue?</a>'
    });
  }

  checkRoute() {
    let Unique_id = sessionStorage.getItem('Unique_id');
    if (Unique_id != undefined) {
      return true;
    } else {
      this.signout();
      return false;
    }
  }

  signout() {
    sessionStorage.clear();
    localStorage.clear();
    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    });
  }

  padTo2Digits(num: number) {
    return num.toString().padStart(2, '0');
  }

  formatDate(date: Date) {
    return (
      [
        date.getFullYear(),
        this.padTo2Digits(date.getMonth() + 1),
        this.padTo2Digits(date.getDate()),
      ].join('-') +
      ' ' +
      [
        this.padTo2Digits(date.getHours()),
        this.padTo2Digits(date.getMinutes()),
        this.padTo2Digits(date.getSeconds()),
      ].join(':')
    );
  }

  private loadData = new BehaviorSubject(false);
  currentLoadData = this.loadData.asObservable();

  changeLoadData(data: boolean) {
    this.loadData.next(data);
  }
}
