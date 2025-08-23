import { Component } from '@angular/core';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router } from '@angular/router';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { DialogService } from '../../../shared/services/dialog.service';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss'
})
export class UserManagementComponent {
  users: User[] = [];
  delayMs = 2000;
  allUsers: User[] = [];

  constructor(
    private userService: UserService, 
    private ngxService: NgxUiLoaderService,
    private snackbarService: SnackbarService,
    private dialogService: DialogService,
    private router: Router) {  }

  ngOnInit() {
    this.ngxService.start();
    this.loadAllUsers();
  }

  loadAllUsers() {
    this.userService.getAllUsers(this.delayMs).subscribe({
      next: (data) => {
        this.allUsers = data;
        this.ngxService.stop();
      },
      error: (err) => {
        console.error('Error loading all users:', err);
        this.ngxService.stop();
      }
    });
  }

  viewUser(data: User) {
    
  }

  deleteUser(userId: string) {
    const dialogRef = this.dialogService.openConfirmationDialog('Are you sure you want to delete this customer', 'custome-dialog');
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        this.ngxService.start();
        this.userService.deleteUser(userId).subscribe((res: any) => {
          if (res) {
            this.ngxService.stop();
            this.snackbarService.openSnackbar('User deleted successfully', 'Success');
            this.loadAllUsers();
          }
        });
      };
    });
  }

  editUser(user: User) {
    this.ngxService.start();
    let inputData = {
      id: user.id,
      name: user.name,
      role: user.role,
      records: user?.records
    }
    this.userService.updateUser(inputData).subscribe(() => {
      this.loadAllUsers();
      this.snackbarService.openSnackbar('User updated successfully', 'Success');
      this.ngxService.stop();
    });
  }
}
