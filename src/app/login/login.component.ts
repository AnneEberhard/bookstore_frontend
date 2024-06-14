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
* starts login, sets storage token in case of success and renders errors in case of failure
*/
  async login() {
      try {
        let resp:any = await this.authService.login(this.username, this.password);
        sessionStorage.setItem('token', resp['token']);
        this.router.navigate(['/main'])
      } catch (error:any) {
        this.errorMessage = 'Error logging in. Please check your login information.';
      }
    }
}
