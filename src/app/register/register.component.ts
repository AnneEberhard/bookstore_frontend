import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { take } from 'rxjs';
import { AuthService } from 'src/shared/services/auth.service';
import { GeneralService } from 'src/shared/services/general.service';
import { CustomUser } from 'src/shared/services/models.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  showErrorEmailAlert: boolean = false;
  showErrorPasswordAlert: boolean = false;
  showErrorPasswordMatchAlert: boolean = false;
  messageHeader: string = '';
  messageText: string = '';
  confirmPassword: string = '';
  success: boolean = false;

  formData: CustomUser = {
    username: '',
    author_pseudonym: '',
    first_name: '',
    last_name: '',
    email: '',
    password: ''
  };

  constructor(private authService: AuthService, public general: GeneralService) { }

  /**
  * starts validation, and if true, sends registration to backend
  * @param {NgForm} form - entered data
  * @returns boolean
  */
  onSubmit(form: NgForm) {
    if (this.checkForm(form)) {
      this.authService.register(this.formData).pipe(take(1))
        .subscribe({
          next: (response) => {
            console.log('User registered successfully:', response);
            this.messageHeader = 'Success';
            this.messageText = 'User registered successfully';
            this.success = true;
          },
          error: (err) => {
            console.error('Registration failed:', err);
            this.messageHeader = 'Failure';
            this.success = false;
            if (err.status === 400 && err.error && err.error.username) {
              this.messageText = err.error.username[0];
            } else {
              this.messageText = 'Registration failed. Please try again.';
            }
          }
        });
    };
    this.general.showOverlay();
  }

  /**
   * starts varies functions to validate the form
   * @param {NgForm} form - entered data
   * @returns boolean
   */
  checkForm(form: NgForm) {
    if (form.valid) {
      if (!this.validateEmail(this.formData.email)) {
        this.renderAlert("email");
        return false;
      }
      if (!this.validatePassword(this.formData.password)) {
        this.renderAlert("password");
        return false;
      }
      if (this.formData.password !== this.confirmPassword) {
        this.renderAlert("passwordMatch");
        return false;
      }
      return true;
    } else {
      return false
    }
  }

  /**
 * checks if email is correct
 * @param {string} email - value of email field
 * @returns boolean
 */
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let checkEmail = emailRegex.test(email)
    if (checkEmail) {
      this.showErrorEmailAlert = false;
    } else {
      this.showErrorEmailAlert = true;
    }
    return checkEmail;
  }

  /**
   * checks if password follows rules of at least 8 characters and not entirely numeric
   * @param {string} password - value of password field
   * @returns boolean
   */
  validatePassword(password: string): boolean {
    if (password.length < 8) {
      this.showErrorPasswordAlert = true;
      return false;
    }
    if (!/[a-zA-Z]/.test(password)) {
      this.showErrorPasswordAlert = true;
      return false;
    }
    this.showErrorPasswordAlert = false;
    return true;
  }

  /**
   * renders alert
   * @param {string} alertType - identifier of alert (email, password, passwordMatch=
   * @returns boolean
   */
  renderAlert(alertType: string) {
    if (alertType === 'email') {
      this.showErrorEmailAlert = true;

    } else if (alertType === 'password') {
      this.showErrorPasswordAlert = true;
    } else if (alertType === 'passwordMatch') {
      this.showErrorPasswordMatchAlert = true;
    }
  }
}
