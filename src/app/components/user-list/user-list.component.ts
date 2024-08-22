import { Component } from '@angular/core';
import { IUserModel } from 'src/app/models/UserModel';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent {
  title:string="All Users List";
  
  userData:IUserModel={
      serial: 4,
      user_id: "leads",
      full_name: "LEADS Corporation Limited",
      email: "hr@leads.com",
      mobile_number: "01234567890",
      present_address: "LEADS Tower, Mirpur 14",
      permanent_address: "LEADS Tower, Mirpur 14"
  }
}
