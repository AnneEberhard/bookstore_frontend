import { APP_INITIALIZER, ErrorHandler, NgModule } from "@angular/core";
import { Router } from "@angular/router";
import * as Sentry from "@sentry/angular";
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LegalComponent } from './legal/legal.component';
import { IndexComponent } from './index/index.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { AuthService } from 'src/shared/services/auth.service';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ScrollComponent } from '../shared/components/scroll/scroll.component';
import { HeaderComponent } from '../shared/components/header/header.component';
import { FooterComponent } from '../shared/components/footer/footer.component';
import { FilterByTitlePipe } from './index/filter-by-title.pipe';
import { BookCreateComponent } from './book-create/book-create.component';
import { BookEditComponent } from './book-edit/book-edit.component';
import { BookDeleteComponent } from './book-delete/book-delete.component';
import { BookBasketComponent } from './book-basket/book-basket.component';


@NgModule({
  declarations: [
    AppComponent,
    LegalComponent,
    IndexComponent,
    RegisterComponent,
    LoginComponent,
    ScrollComponent,
    HeaderComponent,
    FooterComponent,
    FilterByTitlePipe,
    BookCreateComponent,
    BookEditComponent,
    BookDeleteComponent,
    BookBasketComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [{
    provide: ErrorHandler,
    useValue: Sentry.createErrorHandler({
      showDialog: true,
    }),
  }, {
    provide: Sentry.TraceService,
    deps: [Router],
  },
  {
    provide: APP_INITIALIZER,
    useFactory: () => () => {},
    deps: [Sentry.TraceService],
    multi: true,
  },
    AuthService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
