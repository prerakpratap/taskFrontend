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
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
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
      username: [
        '',
        Validators.compose([
          Validators.required,
          Validators.maxLength(15),
          Validators.minLength(2),
        ]),
      ],
    });
  }
  ngOnInit() {
    if (localStorage.getItem('Unique_id')) {
      this.router.navigateByUrl('/dashboard');
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
        username: formVal.username,
      };
      this.commonService.signup(data).subscribe(
        (res) => {
          //localStorage.clear();
          if (res.status === 200) {
            this.popupMessage('Signup  Successfully');

            this.router.navigateByUrl('/login');
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
    this.router.navigate(['/login']);
  }
}
