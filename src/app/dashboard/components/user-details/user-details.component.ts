import { Component } from '@angular/core';
import { User, Record } from '../../models/user.model';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
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
    private ngxService: NgxUiLoaderService
  ) { }

  ngOnInit() {
    this.ngxService.start();
    const storedUser = localStorage.getItem('user');
    this.user = storedUser ? JSON.parse(storedUser) : null;
    this.loadRecords();
  }

  loadRecords() {
    if (this.user?.id) {
      this.userService.getRecords(this.user.id, this.delayMs).subscribe({
        next: (data) => {
          if(data.success) {
          this.records = data.user.records;
          this.ngxService.stop();
          }
        },
        error: (err) => {
          console.error('Error loading records:', err);
          this.ngxService.stop();
        }
      });
    }
  }

  // addUser() {
  //   const newUser: User = { id: 'u103', name: 'New User', password: 'pass1', role: 'General User', records: [] };
  //   this.userService.addUser(newUser).subscribe({
  //     next: () => this.loadAllUsers(),
  //     error: (err) => console.error('Error adding user:', err)
  //   });
  // }

}
