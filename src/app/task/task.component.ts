import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/common.service';
import { MatDialog } from '@angular/material/dialog';

export interface AdminList {
  name: string;
  email: string;
  unique_id: string;
}

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
})
export class TaskComponent {
  loader = false;
  taskListEnable = false;
  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private router: Router,
    public dialog: MatDialog
  ) {
    this.taskForm = fb.group({
      title: [
        '',
        Validators.compose([
          Validators.required,
          Validators.maxLength(30),
          Validators.minLength(2),
        ]),
      ],
      status: ['pending', Validators.compose([Validators.required])],
      description: [
        '',
        Validators.compose([
          Validators.required,
          Validators.maxLength(100),
          Validators.minLength(2),
        ]),
      ],
    });
  }
  list = [];
  public adminFilterCtrl = new FormControl();

  taskForm: FormGroup<any>;
  userAction = true;
  updateButtonEnable = false;
  userDetails: any;
  selectedItem = '';
  isFormSubmitted = false;
  ngOnInit() {}

  get taskFormControl() {
    return this.taskForm?.controls;
  }

  addTask() {
    this.loader = true;
    this.isFormSubmitted = true;
    this.taskForm?.markAllAsTouched();
    if (this.taskForm?.valid) {
      this.isFormSubmitted = false;
      let data = {
        title: this.taskForm?.controls['title'].value,
        status: this.taskForm?.controls['status'].value,
        description: this.taskForm?.controls['description'].value,
      };

      this.commonService
        .createTask(data, localStorage.getItem('Unique_id'))
        .subscribe(
          (res) => {
            if (res.status === 200) {
              this.taskForm.reset();
              this.taskForm?.controls['status'].setValue('pending');
              this.commonService.changeLoadData(true);
              this.commonService.displaySwal(
                res.message,
                'Success!',
                'success'
              );
            } else {
              this.commonService.displaySwal(res.message, 'Info!', 'info');
            }
            this.loader = false;
          },
          (err) => {
            this.loader = false;
            console.log(err);
          }
        );
    } else {
      this.loader = false;
      return;
    }
  }

  logout() {
    localStorage.clear();
    this.router.navigateByUrl('/login');
  }

  radioChange($event: MatRadioChange) {
    if ($event.value === 'false') {
    } else {
    }
  }
}
