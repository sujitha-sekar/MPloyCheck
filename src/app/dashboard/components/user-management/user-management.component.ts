import { Component } from '@angular/core';
import { GetRecordResponse, User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router } from '@angular/router';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { DialogService } from '../../../shared/services/dialog.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { RecordsTableComponent } from '../records-table/records-table.component';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss'
})
export class UserManagementComponent {
  delayMs = 2000;
  currentUser: User | null = null;
  allUsers: User[] = [];
  filteredUsers: User[] = [];

  constructor(
    private userService: UserService,
    private ngxService: NgxUiLoaderService,
    private snackbarService: SnackbarService,
    private dialogService: DialogService,
    private dialog: MatDialog,
    private router: Router) { }

  ngOnInit() {
    this.ngxService.start();
    const storedUser = localStorage.getItem('currentUser');
    this.currentUser = storedUser ? JSON.parse(storedUser) : null;
    this.loadAllUsers();
  }

  loadAllUsers() {
    this.userService.getAllUsers(this.delayMs).subscribe({
      next: (data) => {
        this.allUsers = data;
        this.filteredUsers = this.allUsers.filter(u => u.role === 'General User');
        this.ngxService.stop();
      },
      error: (err) => {
        console.error('Error loading all users:', err);
        this.ngxService.stop();
      }
    });
  }

  viewUser(data: User) {
    console.log('data', data)
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '550px';
    this.userService.getUserDetails(data.id).subscribe({
      next: (latestUser: GetRecordResponse) => {
        dialogConfig.data = {
          action: 'View',
          user: { ...latestUser?.user }
        };
        this.dialog.open(RecordsTableComponent, dialogConfig);
      },
      error: () => {
        this.snackbarService.openSnackbar('Failed to load user details', 'Error');
      }
    });
  }

  deleteUser(userId: string) {
    const dialogRef = this.dialogService.openConfirmationDialog('Are you sure you want to delete this customer', 'custome-dialog');
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.ngxService.start();
        this.userService.deleteUser(userId).subscribe({
          next: (res: any) => {
            if (res.success) {
              const index = this.filteredUsers.findIndex(user => user.id === userId);
              if (index !== -1) {
                this.filteredUsers.splice(index, 1);
              }
              this.snackbarService.openSnackbar('User deleted successfully', 'Success');
            } else {
              this.snackbarService.openSnackbar('Failed to delete user', 'Error');
            }
            this.ngxService.stop();
          },
          error: (err) => {
            console.error('Error deleting user:', err);
            this.snackbarService.openSnackbar('Error deleting user', 'Error');
            this.ngxService.stop();
          }
        });
      }
    });
  }

  editUser(user: User) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '550px';
    this.userService.getUserDetails(user.id).subscribe({
      next: (latestUser: GetRecordResponse) => {
        if (latestUser.success && latestUser.user) {
          dialogConfig.data = {
            action: 'Edit',
            user: { ...latestUser.user }
          };
          const dialogRef = this.dialog.open(RecordsTableComponent, dialogConfig);
          dialogRef.afterClosed().subscribe((updatedUser: User) => {
            if (updatedUser) {
              this.ngxService.start();
              this.userService.updateUser(updatedUser).subscribe({
                next: (res: any) => {
                  if (res.success) {
                    this.snackbarService.openSnackbar('User updated successfully', 'Success');
                    this.loadAllUsers();
                  } else {
                    this.snackbarService.openSnackbar('Failed to update user', 'Error');
                  }
                  this.ngxService.stop();
                },
                error: (err) => {
                  console.error('Error updating user:', err);
                  this.snackbarService.openSnackbar('Error updating user', 'Error');
                  this.ngxService.stop();
                }
              });
            }
          });
        } else {
          this.snackbarService.openSnackbar('Failed to load user details for editing', 'Error');
        }
      },
      error: (err) => {
        console.error('Error fetching user details for editing:', err);
        this.snackbarService.openSnackbar('Failed to load user details for editing', 'Error');
      }
    });
  }
}
