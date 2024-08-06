import { Component, OnDestroy, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnDestroy {
  email: string = '';
  password: string = '';
  loginError: boolean = false;
  errorMessage: string = '';
  submitAttempted: boolean = false;
  private subscription: Subscription = new Subscription();

  registerEmail: string = '';
  registerPassword: string = '';
  registerRole: string = 'USER';
  registerSubmitAttempted: boolean = false;
  isRegisterPopupVisible: boolean = false;
  registerError: string = '';
  isSuccessPopupVisible: boolean = false;
  successMessage: string = '';

  @ViewChild('loginForm') loginForm!: NgForm;
  @ViewChild('registerForm') registerForm!: NgForm;

  constructor(private authService: AuthService) {}

  onSubmit(): void {
    this.submitAttempted = true;
    if (!this.loginForm.valid) {
      this.loginError = true;
      this.errorMessage = "Please check your entries and try again.";
      return;
    }

    this.subscription.add(
      this.authService.login(this.email, this.password).subscribe({
        next: (response) => {
          console.log('Login successful', response);
          this.loginError = false;
          this.errorMessage = '';
        },
        error: (error) => {
          console.error('Login failed', error);
          this.loginError = true;
          if (error.status === 404) {
            this.errorMessage = 'Email does not exist.';
          } else if (error.status === 401) {
            this.errorMessage = 'Incorrect password.';
          } else {
            this.errorMessage = 'Login failed. Please check your email and password.';
          }
        }
      })
    );
  }

  showRegisterPopup(): void {
    this.isRegisterPopupVisible = true;
    this.registerError = '';
  }

  hideRegisterPopup(): void {
    this.isRegisterPopupVisible = false;
  }

  showSuccessPopup(message: string): void {
    this.successMessage = message;
    this.isSuccessPopupVisible = true;
  }

  hideSuccessPopup(): void {
    this.isSuccessPopupVisible = false;
  }

  onRegisterSubmit(): void {
    this.registerSubmitAttempted = true;
    if (!this.registerForm.valid) {
      return;
    }

    this.authService.register(this.registerEmail, this.registerPassword, this.registerRole).subscribe({
      next: () => {
        this.hideRegisterPopup();
        this.registerError = '';
        this.showSuccessPopup('User created successfully!');
      },
      error: (error) => {
        console.error('Registration failed', error);
        if (error.message === 'Email already exists.') {
          this.registerError = 'Email already exists.';
        } else {
          this.registerError = 'An unknown error occurred.';
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}


