import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from '../../app.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

    forgotPassToken: any;
    userId: any;
    newPassword: any;

    constructor(public router: Router, private _route: ActivatedRoute, public service: AppService, private toastr: ToastrService, private spinner: NgxSpinnerService) { }

    ngOnInit() {
        /** spinner starts on init */
        this.spinner.show();

        setTimeout(() => {
            /** spinner ends after 3 seconds */
            this.spinner.hide();
        }, 3000);
        this.forgotPassToken = this._route.snapshot.paramMap.get('forgotPassToken');
        console.log(this.forgotPassToken);
        this.service.authorizeUser(this.forgotPassToken).subscribe((data) => {
            console.log(data);
            if (data.status === 200) {
                this.userId = data.data.userId;

            }
            else {
                console.log("Un-Authorized access");
            }
        });
    }

    changePassword = () => {
        let data = {
            newPassword: this.newPassword,
            userId: this.userId
        }
        this.service.changePassword(data).subscribe((apiResponse) => {
            console.log(apiResponse);
            if (apiResponse.status === 200) {
                this.toastr.success(apiResponse.message);
                this.router.navigate(['/']);
            }
        });
    }; // end of changePassword

}