import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'app-something-went-wrong',
    templateUrl: './something-went-wrong.component.html',
    styleUrls: ['./something-went-wrong.component.css']
})
export class SomethingWentWrongComponent implements OnInit {

    constructor(private spinner: NgxSpinnerService) { }

    ngOnInit() {
        /** spinner starts on init */
        this.spinner.show();

        setTimeout(() => {
            /** spinner ends after 3 seconds */
            this.spinner.hide();
        }, 3000);
    }

}