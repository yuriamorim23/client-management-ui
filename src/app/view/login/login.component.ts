import { Component, OnDestroy, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnDestroy {
  email: string = '';
  password: string = '';
  private subscription: Subscription = new Subscription();

  constructor(private authService: AuthService) {}

  onSubmit(): void {
    this.subscription.add(
      this.authService.login(this.email, this.password).subscribe(
        response => {
          console.log('Login successful', response);
        },
        error => {
          console.error('Login failed', error);
        }
      )
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
