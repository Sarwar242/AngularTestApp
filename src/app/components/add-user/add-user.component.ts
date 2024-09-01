import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
  isLoading = false;

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      serial: [''],
      user_id: [''],
      full_name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      mobile_number: ['01', [Validators.required, Validators.pattern(/^[0-9]{11}$/)]],
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
    this.isLoading = true;
    this.userService.getUserById(user_id).subscribe((response): any => {
      if (response.status === "OK") {
        const userData = response.result as IUserModel[];
        this.userForm.patchValue(userData[0]);
        this.isDisabled = true;
        this.submitBtn = "Update";
        this.isLoading = false;
      } else {
        this.submitBtn = "Submit";
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      this.isLoading = true;
      this.userRequest = {
        user_id: this.userForm.get('user_id')?.value,
        full_name: this.userForm.get('full_name')?.value,
        email: this.userForm.get('email')?.value,
        mobile_number: this.userForm.get('mobile_number')?.value,
        present_address: this.userForm.get('present_address')?.value,
        permanent_address: this.userForm.get('permanent_address')?.value
      };
      
      if (this.user_id) {
        this.userRequest.serial = this.userForm.get('serial')?.value;
      }

      this.userService.saveUserData(this.userRequest).subscribe((req) => {
        if (req.status == "OK") {
          this.isLoading = false;
          this.router.navigate(['/']);
        }
      });
    } else {
      this.markFormGroupTouched(this.userForm);
    }
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // Helper methods for template
  isFieldInvalid(fieldName: string): boolean {
    const control = this.userForm.get(fieldName);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  getErrorMessage(fieldName: string): string {
    const control = this.userForm.get(fieldName);
    if (control) {
      if (control.hasError('required')) {
        return 'This field is required';
      }
      if (control.hasError('email')) {
        return 'Please enter a valid email address';
      }
      if (control.hasError('pattern') && fieldName === 'mobile_number') {
        return 'Please enter a valid 11-digit mobile number';
      }
    }
    return '';
  }
}