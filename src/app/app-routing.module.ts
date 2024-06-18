import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { LegalComponent } from './legal/legal.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from 'src/shared/services/auth.guard';
import { BookCreateComponent } from './book-create/book-create.component';
import { BookEditComponent } from './book-edit/book-edit.component';

const routes: Routes = [
  { path: '', component: IndexComponent },
  { path: 'login', component: LoginComponent },
  { path: 'legal', component: LegalComponent },
  { path: 'main', component: IndexComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'book-add', component: BookCreateComponent, canActivate: [AuthGuard]},
  { path: 'book-edit/:id', component: BookEditComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
