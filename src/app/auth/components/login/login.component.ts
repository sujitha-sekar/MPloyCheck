import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { QueryList, ViewChildren, ElementRef } from '@angular/core';
import { LoginInput } from '../../models/login.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  selectedRole: string = 'General User';
  underlineWidth: string = '0px';
  underlineLeft: string = '0px';
  @ViewChildren('tab') tabs!: QueryList<ElementRef>;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = new FormGroup({
      id: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required])
    });
  }

  ngAfterViewInit() {
    this.updateUnderline();
    this.tabs.changes.subscribe(() => this.updateUnderline());
  }

  selectRole(role: string) {
    this.selectedRole = role;
    this.updateUnderline();
  }

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
    }
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const inputData: LoginInput = {
        id: this.loginForm.value.id || '',
        password: this.loginForm.value.password || '',
        role: this.selectedRole
      };
      this.authService.login(inputData).subscribe({
        next: (response) => {
          console.log('login response:', response);
          if (response?.success) {
            localStorage.setItem('user', JSON.stringify(response.user));
            this.router.navigate(['/dashboard'], { state: { user: response.user } });
          } else {
            alert('Invalid credentials');
          }
        },
        error: () => alert('Login failed')
      });
    }
  }
}