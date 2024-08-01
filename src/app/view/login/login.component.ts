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

  @ViewChild('loginForm') loginForm!: NgForm

  constructor(private authService: AuthService) {}

  onSubmit(): void {
    this.submitAttempted = true;
    if (!this.loginForm.valid) {
      this.loginError = true;
      this.errorMessage = "Please check your entries and try again.";
      return; // Evitar que a execução continue se o formulário não estiver válido.
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
          // Ajuste para diferenciar corretamente entre os erros de email e senha
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

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
