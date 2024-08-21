import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import { CommonService } from 'src/app/common.service';

@Component({
  selector: 'app-dialog-content',
  templateUrl: './dialog-content.component.html',
  styleUrls: ['./dialog-content.component.scss'],
})
export class DialogContentComponent implements OnInit {
  superAdminDialog = false;
  list: any;
  viewDialog = false;
  dataList: any;
  loader = false;
  taskForm: FormGroup<any>;
  isFormSubmitted = false;
  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogContentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private commonService: CommonService
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

  ngOnInit() {
    this.viewDialog = true;
    this.dataList = this.data.data;
  }

  updateValue(data: any) {
    return data.toUpperCase();
  }

  get taskFormControl() {
    return this.taskForm?.controls;
  }

  radioChange($event: MatRadioChange) {
    if ($event.value === 'false') {
    } else {
    }
  }

  editTask() {
    this.viewDialog = false;
    let data = this.dataList;
    console.log('data', data);
    this.taskForm?.patchValue({
      title: data['Title'],
      status: data['Status'],
      description: data['Description'],
    });
  }

  updateForm() {
    this.loader = true;
    let id = this.dataList['Task Id'];
    this.isFormSubmitted = true;
    if (this.taskForm?.valid) {
      this.isFormSubmitted = false;
      let data = {
        title: this.taskForm?.controls['title'].value,
        status: this.taskForm?.controls['status'].value,
        description: this.taskForm?.controls['description'].value,
      };

      this.commonService.updateTask(data, id).subscribe(
        (res) => {
          this.loader = false;
          if (res.status === 200) {
            this.commonService.displaySwal(res.message, 'Success!', 'success');
            // this.dialogRef.close();
          } else {
            this.commonService.displaySwal(res.message, 'Info!', 'info');
          }
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
}
