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
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss'
})
export class UserManagementComponent {
  /**
   * Varibale which hold the delay time.
   */
  delayMs = 2000;
  /**
   * Variable which hold the current user details.
   */
  currentUser: User | null = null;
  /**
   * Variable which hold the all user list.
   */
  allUsers: User[] = [];
  /**
   * Variable which hold the filtered user list.
   */
  filteredUsers: User[] = [];
  /**
   * Variable which is used to subscribe and unsubscribe the subscriptions.
   * @type {Subscription}
   */
  subscriptionObj: Subscription = new Subscription();
  /**
   * Component constructor which is used to inject the required services.
   * @param userService to get the user details.
   * @param ngxService to get the loader.
   * @param snackbarService to display the snack bar.
   * @param dialogService to access the method inside it.
   * @param dialog to display the dialog.
   * @param router used to navigate. 
   */
  constructor(
    private userService: UserService,
    private ngxService: NgxUiLoaderService,
    private snackbarService: SnackbarService,
    private dialogService: DialogService,
    private dialog: MatDialog,
    private router: Router) { }
  /**
   * Angular Life cycle hooks that initiate component
   */
  ngOnInit() {
    this.ngxService.start();
    const storedUser = localStorage.getItem('currentUser');
    this.currentUser = storedUser ? JSON.parse(storedUser) : null;
    this.loadAllUsers();
  }
  /**
   * Method which is used to load all the users.
   */
  loadAllUsers() {
    this.subscriptionObj.add(this.userService.getAllUsers(this.delayMs).subscribe({
      next: (data) => {
        this.allUsers = data;
        this.filteredUsers = this.allUsers.filter(u => u.role === 'General User');
        this.ngxService.stop();
      },
      error: (err) => {
        console.error('Error loading all users:', err);
        this.ngxService.stop();
      }
    }));
  }
  /**
   * Method which is used to view the user details.
   * @param data hold the user data.
   */
  viewUser(data: User) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '550px';
    this.subscriptionObj.add(this.userService.getUserDetails(data.id).subscribe({
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
    }));
  }
  /**
   * Method which is used to delete the user.
   * @param userId hold the user id.
   */
  deleteUser(userId: string) {
    const dialogRef = this.dialogService.openConfirmationDialog('Are you sure you want to delete this customer', 'custome-dialog');
    this.subscriptionObj.add(dialogRef.afterClosed().subscribe((result: boolean) => {
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
    }));
  }
  /**
   * Method which is used to edit the user details.
   * @param user hold the user details.
   */
  editUser(user: User) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '550px';
    this.subscriptionObj.add(this.userService.getUserDetails(user.id).subscribe({
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
    }));
  };
  /**
   * A lifecycle hook to unsubscribe all details
   */
  ngOnDestory() {
    if (this.subscriptionObj) this.subscriptionObj.unsubscribe();
  }
}
