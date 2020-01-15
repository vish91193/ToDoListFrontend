import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, ActivatedRoute, Router, } from '../../../node_modules/@angular/router';
import { Cookie } from '../../../node_modules/ng2-cookies/ng2-cookies';

@Injectable({
    providedIn: 'root'
})
export class TodoListRouteGaurdService implements CanActivate {

    constructor(private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot): boolean {
        console.log("In todo-list-route-gaurd");
        if (Cookie.get('authToken') === null || Cookie.get('authToken') === undefined || Cookie.get('authToken') === '') {
            this.router.navigate(['/']);
            return false;
        }
        else {
            return true;
        }
    }
}