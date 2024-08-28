import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IUserModel } from 'src/app/models/UserModel';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent implements OnInit {
  title: string = "All Users List";
  userList: IUserModel[] = [];
  isLoading=false;

 constructor(private userService:UserService, private router:Router) {
 }

  ngOnInit(): void {
    this.getUserList();
  }

  getUserList() {
    this.isLoading=true;
    this.userService.getUserList().subscribe((response): any => {
      
      if (response.status === "OK")
        this.userList = response.result as IUserModel[];
      this.isLoading=false;
    },
    error => {
      this.isLoading = false;
      console.error('Error fetching user list:', error);
    })
  }

  deleteUser(serial?:number) {
    this.isLoading=true;
    this.userService.deleteUserData(serial).subscribe((response): any => {
      
      if (response.status === "OK")
        this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
          this.getUserList();
        });
      
      else this.isLoading=false;
    })
  }

  onEdit(user_id?: string): void {
    this.router.navigate(['/edit-user', user_id]);
  }

  onDelete(serial?:number){
    const isConfirmed = confirm('Are you sure you want to delete this user?');
    if (isConfirmed) {
      this.deleteUser(serial);
    }
  }

}
