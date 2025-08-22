import { Component } from '@angular/core';
import { User , Record} from '../../models/user.model';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss'
})
export class UserDetailsComponent {
 user: User | null = null;
  records: Record[] = [];
  allUsers: User[] = [];
  delayMs = 2000;

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private ngxService: NgxUiLoaderService
  ) {
    const storedUser = localStorage.getItem('user');
    this.user = storedUser ? JSON.parse(storedUser) : null;
  }

  ngOnInit() {
    console.log('user:', this.user)
    if (this.user) {
      this.ngxService.start();
      // this.loadUserDetails();
      this.loadRecords();
      // if (this.user.role === 'Admin') {
      //   this.loadAllUsers();
      // }
    }
  }

  // loadUserDetails() {
  //   this.ngxService.start();
  //   this.userService.getUserDetails().subscribe({
  //     next: (data) => {
  //       this.user = data;
  //       this.ngxService.stop();
  //     },
  //     error: (err) => {
  //       console.error('Error loading user details:', err);
  //       this.ngxService.stop();
  //     }
  //   });
  // }

  loadRecords() {
    if (this.user?.id) {
      this.userService.getRecords(this.user.id, this.delayMs).subscribe({
        next: (data) => {
          this.records = data;
          this.ngxService.stop();
        },
        error: (err) => {
          console.error('Error loading records:', err);
          this.ngxService.stop();
        }
      });
    }
  }

  // loadAllUsers() {
  //   this.ngxService.start();
  //   this.userService.getAllUsers(this.delayMs).subscribe({
  //     next: (data) => {
  //       this.allUsers = data;
  //       this.ngxService.stop();
  //     },
  //     error: (err) => {
  //       console.error('Error loading all users:', err);
  //       this.ngxService.stop();
  //     }
  //   });
  // }

  // addUser() {
  //   const newUser: User = { id: 'u103', name: 'New User', password: 'pass1', role: 'General User', records: [] };
  //   this.userService.addUser(newUser).subscribe({
  //     next: () => this.loadAllUsers(),
  //     error: (err) => console.error('Error adding user:', err)
  //   });
  // }

  // updateUser(user: User) {
  //   const updatedUser = { ...user, name: 'Updated ' + user.name };
  //   this.userService.updateUser(updatedUser).subscribe({
  //     next: () => this.loadAllUsers(),
  //     error: (err) => console.error('Error updating user:', err)
  //   });
  // }

  // deleteUser(userId: string) {
  //   this.userService.deleteUser(userId).subscribe({
  //     next: () => this.loadAllUsers(),
  //     error: (err) => console.error('Error deleting user:', err)
  //   });
  // }
}
