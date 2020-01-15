import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
//Removes staticinjectorerror
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { RouterModule, Router } from '@angular/router';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        NgxSpinnerModule,
        BrowserAnimationsModule, // required animations module
        ToastrModule.forRoot()
    ],
    declarations: [LoginComponent, ForgotPasswordComponent]
})
export class UserModule { }