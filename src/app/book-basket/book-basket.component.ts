import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/shared/services/auth.service';
import { BackendService } from 'src/shared/services/backend.service';
import { GeneralService } from 'src/shared/services/general.service';

@Component({
  selector: 'app-book-basket',
  templateUrl: './book-basket.component.html',
  styleUrls: ['./book-basket.component.scss']
})
export class BookBasketComponent {

  constructor(public authService: AuthService, private router: Router, public general: GeneralService) {
  }

  /**
   * Displays an alert window notifying the user that the checkout process
   * is currently interrupted due to external circumstances (e.g., business interruption).
   */
  checkOut() {
    window.alert('The Empire has currently interrupted all business. Ha Ha Ha.');
  }
}
