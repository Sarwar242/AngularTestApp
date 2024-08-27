import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { IUserModel } from 'src/app/models/UserModel';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
  submitBtn: string = "Submit";
  userForm!: FormGroup;
  userRequest: IUserModel = {};
  isDisabled: boolean = true;
  user_id?: string;
  userModelList: IUserModel[] = [];
  userModel: IUserModel = {};

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      serial: [0],
      user_id: [''],
      full_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile_number: ['01', Validators.required],
      present_address: [''],
      permanent_address: ['']
    });
    this.userForm.get('serial')?.disable();
    this.user_id = this.route.snapshot.params['user_id'];
    if (this.user_id) {
      this.fetchUserData(this.user_id);
      this.submitBtn = "Update";
    } else {
      this.submitBtn = "Submit";
    }
  }

  fetchUserData(user_id: string): void {
    this.userService.getUserById(user_id).subscribe((response): any => {
      if (response.status === "OK") {
        const userData = response.result as IUserModel[];
        this.userForm.patchValue(userData[0]);
        this.isDisabled = true;
        this.submitBtn = "Update";
      } else {
        this.submitBtn = "Submit";
      }
    });
  }


  onSubmit(): void {
    if (this.userForm.valid) {
      this.userRequest.user_id = this.userForm.controls['user_id'].value;
      this.userRequest.full_name = this.userForm.controls['full_name'].value;
      this.userRequest.email = this.userForm.controls['email'].value;
      this.userRequest.mobile_number = this.userForm.controls['mobile_number'].value;
      this.userRequest.present_address = this.userForm.controls['present_address'].value;
      this.userRequest.permanent_address = this.userForm.controls['permanent_address'].value;
      if (this.userForm.controls['user_id'].value) {
        this.userRequest.serial = this.userForm.controls['serial'].value;
      }

      this.userService.saveUserData(this.userRequest).subscribe((req) => {
        if (req.status == "OK") {
          this.router.navigate(['/']);
        }
      });
    }
  }
}