import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
//Importing observables related code
import { Observable } from "rxjs";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';


@Injectable({
    providedIn: 'root'
})
export class AppService {

    private baseUrl = 'http://api.apptest24.xyz/api/v1';
    //private baseUrl = 'http://localhost:3002/api/v1';

    constructor(public http: HttpClient) { }

    // for HTML5 local storage
    public setUserInfoInLocalStorage = (data) => {
        // converting the JSON into string and storing
        localStorage.setItem('userInfo', JSON.stringify(data));
    }

    public getUserInfoFromLocalStorage = () => {
        // getting back the string in the JSON format
        return JSON.parse(localStorage.getItem('userInfo'));
    }

    public signInFunction(data): any {
        const params = new HttpParams()
            .set('firstName', data.firstName)
            .set('lastName', data.lastName)
            .set('password', data.password)
            .set('email', data.email)
            .set('mobileNumber', data.mobileNumber)
            .set('country', data.country)
            .set('countryCode', data.countryCode);

        let response = this.http.post(`${this.baseUrl}/users/signup`, params);
        return response;

    };

    public loginFunction(data): any {
        const params = new HttpParams()
            .set('password', data.password)
            .set('email', data.email)

        let response = this.http.post(`${this.baseUrl}/users/login`, params);
        return response;
    };

    public sendMail(data): any {
        const params = new HttpParams()
            .set('email', data);

        let response = this.http.post(`${this.baseUrl}/users/sendMail`, params);
        return response;
    };

    public authorizeUser(data): any {
        const params = new HttpParams()
            .set('forgotPassToken', data);

        let response = this.http.post(`${this.baseUrl}/users/authorizeUser`, params);
        return response;
    };

    public changePassword(data): any {
        const params = new HttpParams()
            .set('newPassword', data.newPassword)
            .set('userId', data.userId)

        let response = this.http.put(`${this.baseUrl}/users/changePassword`, params);
        return response;
    };

    public searchFriend(fullName, authToken): any {
        let response = this.http.get(`${this.baseUrl}/users/getFriend/${fullName}?authToken=${authToken}`);
        return response;
    };

    // create list
    public logoutUser(userId, authToken): any {
        const params = new HttpParams()
            .set('userId', userId);
        let response = this.http.post(`${this.baseUrl}/users/logout?authToken=${authToken}`, params);
        return response;
    };

    // todo list

    public getAllPrivateListOfAUser(userId, authToken): any {
        let response = this.http.get(`${this.baseUrl}/lists/getAll/private/${userId}?authToken=${authToken}`);
        return response;
    };

    public getAllPublicListOfAUser(userId, authToken): any {
        let response = this.http.get(`${this.baseUrl}/lists/getAll/public/${userId}?authToken=${authToken}`);
        return response;
    };

    public getListByListId(listId, authToken): any {
        let response = this.http.get(`${this.baseUrl}/lists/getList/${listId}?authToken=${authToken}`);
        return response;
    };

    // create item
    public createAItem(data, authToken): any {
        const params = new HttpParams()
            .set('listId', data.listId)
            .set('itemName', data.itemName)
            .set('parentId', data.parentId)
            .set('status', data.status)
            .set('createdBy', data.createdBy);
        let response = this.http.post(`${this.baseUrl}/lists/create/item?authToken=${authToken}`, params);
        return response;
    };

    // create list
    public createAList(data, authToken): any {
        const params = new HttpParams()
            .set('listName', data.listName)
            .set('private', data.private)
            .set('createdBy', data.createdBy);
        let response = this.http.post(`${this.baseUrl}/lists/create/list?authToken=${authToken}`, params);
        return response;
    };

    // undo
    public undoAList(listId, authToken): any {
        let response = this.http.get(`${this.baseUrl}/lists/undo/list/${listId}?authToken=${authToken}`);
        return response;
    };

    // edit
    public editAList(listId, list, authToken): any {
        let response = this.http.post(`${this.baseUrl}/lists/edit/list/${listId}?authToken=${authToken}`, list);
        return response;
    };

    // delete item
    public deleteAItem(listId, itemId, authToken): any {
        const params = new HttpParams()
            .set('itemId', itemId)
        let response = this.http.post(`${this.baseUrl}/lists/delete/item/${listId}?authToken=${authToken}`, params);
        return response;
    };

    // delete list
    public deleteAList(listId, authToken): any {
        const params = new HttpParams()
            .set('listId', listId)
        let response = this.http.post(`${this.baseUrl}/lists/delete/list?authToken=${authToken}`, params);
        return response;
    };

    // notifications
    public getNotification(userId, authToken): any {
        let response = this.http.get(`${this.baseUrl}/friendRequest/get/notification/${userId}?authToken=${authToken}`);
        return response;
    };

    // updateRequest
    public updateRequest(data, authToken): any {
        const params = new HttpParams()
            .set('senderId', data.senderId)
            .set('senderName', data.senderName)
            .set('receiverId', data.receiverId)
            .set('receiverName', data.receiverName)
            .set('status', data.status);
        let response = this.http.put(`${this.baseUrl}/friendRequest/update/request?authToken=${authToken}`, params);
        return response;
    };

    //general exception handler for http request
    private handleError(err: HttpErrorResponse) {
        console.log("Handle error http calls");
        console.log(err.message);
        return Observable.throw(err.message);
    }
}