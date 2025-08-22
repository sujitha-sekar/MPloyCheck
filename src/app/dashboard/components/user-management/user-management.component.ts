import { Component } from '@angular/core';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss'
})
export class UserManagementComponent {
// users: User[] = [];

  constructor(private userService: UserService) {
    // this.loadUsers();
  }

  // loadUsers() {
  //   this.userService.getAllUsers().subscribe(data => this.users = data);
  // }

  // addUser() {
  //   const newUser: User = { userId: 'user2', password: 'pass2', role: 'General User' };
  //   this.userService.addUser(newUser).subscribe(() => this.loadUsers());
  // }

  // deleteUser(userId: string) {
  //   this.userService.deleteUser(userId).subscribe(() => this.loadUsers());
  // }
}
