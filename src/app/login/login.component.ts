import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../common.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loader = false;
  loginForm: FormGroup<any>;
  copyAndPasteError = false;
  copyPaste = 'Copy and Paste not allow.';
  submitted = false;
  showPassword = false;
  constructor(
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private commonService: CommonService
  ) {
    this.loginForm = fb.group({
      email: [
        '',
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.pattern(
            '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'
          ),
        ]),
      ],
      password: ['', Validators.compose([Validators.required])],
    });
  }

  ngOnInit() {
    if (localStorage.getItem('Unique_id') == null) {
      this.router.navigateByUrl('/login');
    }
  }

  popupMessage(str: string) {
    this._snackBar.open(str, 'Close', {
      duration: 2000,
    });
  }

  checkOnPaste() {
    this.popupMessage(this.copyPaste);
    this.copyAndPasteError = true;
    setTimeout(() => {
      this.copyAndPasteError = false;
    }, 2000);
    return false;
  }

  get loginFormControl() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    } else {
      this.loader = true;
      const formVal = this.loginForm.value;
      const data = {
        email: formVal.email,
        password: formVal.password,
      };
      this.commonService.loginUser(data).subscribe(
        (res) => {
          //localStorage.clear();
          if (res.status === 200) {
            console.log('res.data', res.data);
            localStorage.setItem('Unique_id', res.data.unique_id);
            localStorage.setItem('user', JSON.stringify(res.data));
            localStorage.setItem('token', JSON.stringify(res.token));
            this.popupMessage('Login Successfully');

            this.router.navigateByUrl('/dashboard');
          } else {
            this.commonService.displaySwal(
              res.message,
              'Failed to login!',
              'info'
            );
          }
          this.loader = false;
        },
        (err) => {
          console.log(err);
          this.loader = false;
          this.commonService.displaySwal(
            'Something went wrong, please try again later!',
            'Failed to login!',
            'error'
          );
        }
      );
    }
  }

  redirect() {
    this.router.navigate(['/signup']);
  }
}
