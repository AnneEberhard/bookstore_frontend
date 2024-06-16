import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

/**
* starts login and renders errors in case of failure
*/
login(): void {
  this.authService.login(this.username, this.password).subscribe({
    next: (response) => {
      this.authService.setTokens(response.access, response.refresh);
      localStorage.setItem('user', this.username);
      this.router.navigate(['/']); 
    },
    error: (error) => {
      this.errorMessage = 'Login failed. Please check your username and password.';
    }
  });
}
}
