import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LegalComponent } from './legal/legal.component';
import { IndexComponent } from './index/index.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { BookComponent } from './book/book.component';
import { AuthService } from 'src/shared/services/auth.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Interceptor } from 'src/shared/services/interceptor.service';
import { ScrollComponent } from '../shared/components/scroll/scroll.component';
import { HeaderComponent } from '../shared/components/header/header.component';
import { FooterComponent } from '../shared/components/footer/footer.component';
import { FilterByTitlePipe } from './index/filter-by-title.pipe';

@NgModule({
  declarations: [
    AppComponent,
    LegalComponent,
    IndexComponent,
    RegisterComponent,
    LoginComponent,
    BookComponent,
    ScrollComponent,
    HeaderComponent,
    FooterComponent,
    FilterByTitlePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: Interceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
