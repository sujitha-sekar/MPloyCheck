import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { QueryList, ViewChildren, ElementRef } from '@angular/core';
import { LoginInput } from '../../models/login.model';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { UserService } from '../../../dashboard/services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit, OnDestroy {
  /**
   * Form group for login inputs,
   */
  loginForm!: FormGroup;
  /**
   * Variable which is used to hold the default user role.
   * @type { string }
   */
  selectedRole: string = 'General User';
  /**
   * Variable which is user to hold the width of border.
   * @type { string }
   */
  underlineWidth: string = '0px';
  /**
   * Variable which is user to hold the width of left border.
   * @type { string }
   */
  underlineLeft: string = '0px';
  /**
   * Variable which is used to get the tab.
   * @type { QueryList<ElementRef> }
   */
  @ViewChildren('tab') tabs!: QueryList<ElementRef>;
  /**
   * Variable which is used for subscription
   */
  subscriptionObj: Subscription = new Subscription();
  /**
   * Component constructor which is used to inject the required services.
   * @param authService - - Used to get the required value/methods.
   * @param router - The route object used to navigate to different routes.
   * @param snackbarService - Used to display the snackbar.
   * @param ngxService - Used to get the loader.
   * @param userService - Used to get the required value/methods.
   */
  constructor(
    private authService: AuthService,
    private router: Router,
    private snackbarService: SnackbarService,
    private ngxService: NgxUiLoaderService,
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) { }
  /**
   * Angular Life cycle hooks that initiate component
   */
  ngOnInit() {
    this.loginForm = new FormGroup({
      id: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required])
    });
  }
  /**
   * Angular lifecycle method to handle after view init.
   */
  ngAfterViewInit() {
    setTimeout(() => {
      this.updateUnderline();
    }, 0);
    this.subscriptionObj.add(this.tabs.changes.subscribe(() => {
      this.updateUnderline();
      this.cdr.detectChanges(); // Manually trigger change detection
    }));
  }

  /**
   * Method which is used to select the user role.
   * @param role - which hold the role value.
   */
  selectRole(role: string) {
    this.selectedRole = role;
    this.updateUnderline();
  }
  /**
   * Method used to update the animation in login tab
   */
  updateUnderline() {
    const activeTab = this.tabs.find((tab: ElementRef) =>
      tab.nativeElement.textContent.trim() === this.selectedRole
    );
    if (activeTab) {
      const tabElement = activeTab.nativeElement;
      const container = tabElement.parentElement;
      if (container) {
        const rect = tabElement.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        this.underlineWidth = `${rect.width}px`;
        this.underlineLeft = `${rect.left - containerRect.left}px`;
      }
    };
  }
  /**
   * Method which is used login.
   */
  onSubmit() {
    this.ngxService.start();
    if (this.loginForm.valid) {
      const inputData: LoginInput = {
        id: this.loginForm.value.id || '',
        password: this.loginForm.value.password || '',
        role: this.selectedRole
      };
      this.subscriptionObj.add(
        this.authService.login(inputData).subscribe({
          next: (response) => {
            if (response?.success) {
              this.userService.setCurrentUser(response.user);
              this.router.navigate(['/dashboard/user-details']);
            } else {
              this.snackbarService.openSnackbar('Invalid credentials', 'Error');
            }
            this.ngxService.stop();
          },
          error: () => {
            this.ngxService.stop();
            this.snackbarService.openSnackbar('Failed to Login', 'Error');
          }
        })
      );
    } else {
      this.ngxService.stop();
      this.snackbarService.openSnackbar('Please fill all required fields', 'Error');
    }
  }
  /**
   * Component OnDestroy to unsubscribe all the subscriptions
   */
  ngOnDestroy() {
    if (this.subscriptionObj) this.subscriptionObj.unsubscribe();
  }
}