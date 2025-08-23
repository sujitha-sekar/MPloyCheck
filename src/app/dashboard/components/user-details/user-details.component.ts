import { Component } from '@angular/core';
import { User, Record } from '../../models/user.model';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss'
})
export class UserDetailsComponent {
  /**
   * Variable which is used to hold the user details.
   */
  user: User | null = null;
  /**
   * Variable which is user to hold the user record details.
   */
  records: Record[] = [];
  /**
   * Variable which hold the all user datas.
   */
  allUsers: User[] = [];
  /**
   * Variable which hold the delay time.
   */
  delayMs = 2000;
  /**
   * Variable which is used to subscribe and unsubscribe the subscriptions.
   * @type {Subscription}
   */
  subscriptionObj: Subscription = new Subscription();
  /**
   * Component constructor which is used to inject the required services.
   * @param userService to get the user details.
   * @param ngxService to get loader.
   */
  constructor(
    private userService: UserService,
    private ngxService: NgxUiLoaderService
  ) { }
  /**
   * Angular Life cycle hooks that initiate component
   */
  ngOnInit() {
    this.ngxService.start();
    const storedUser = localStorage.getItem('currentUser');
    this.user = storedUser ? JSON.parse(storedUser) : null;
    this.loadRecords();
  }
  /**
   * Method which is used to load the user records.
   */
  loadRecords() {
    if (this.user?.id) {
      this.subscriptionObj.add(this.userService.getRecords(this.user.id, 0).subscribe({
        next: (data) => {
          if (data.success) {
            this.records = data.user.records;
            this.ngxService.stop();
          }
        },
        error: () => {
          this.ngxService.stop();
        }
      }));
    }
  }

  /**
   * A lifecycle hook to unsubscribe all details
   */
  ngOnDestory() {
    if (this.subscriptionObj) this.subscriptionObj.unsubscribe();
  }

}
