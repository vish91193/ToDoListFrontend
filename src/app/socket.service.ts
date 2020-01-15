import { Injectable } from '@angular/core';
//Importing HttpClient and HttpErrorResponse
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
//Importing observables related code
import { Observable } from "rxjs";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
//for cookies
import { Cookie } from 'ng2-cookies/ng2-cookies';
// io as socket.io-client
import * as io from 'socket.io-client';

@Injectable({
    providedIn: 'root'
})
export class SocketService {

    //private socketBaseUrl = 'http://localhost:3002/RealTimeToDoList';
    private socketBaseUrl = 'http://api.apptest24.xyz/RealTimeToDoList';
    private socket;

    constructor(public http: HttpClient) {
        console.log("Socket service");
        // connecting to the server
        // here the handshaking is made
        this.socket = io(this.socketBaseUrl);
    }

    public verifyUser = () => {
        let listen = Observable.create((observer) => {
            this.socket.on('verify-user', (data) => {
                console.log("Received data from verify-user event");
                observer.next(data);

            });
        });
        return listen;
    }; // end of verifyUser

    public setUser = (authToken) => {
        this.socket.emit('set-user', authToken);
    }; // end of setUser

    public sendRequest = (data) => {
        this.socket.emit('send-request', data);
    }; // end of sendRequest

    public requestAcceptedNotification = (data) => {
        this.socket.emit('request-accepted', data);
    }; // end of requestAcceptedNotification

    public getFriendsList = (userId) => {
        this.socket.emit('get-friends', userId);
    }; // end of getFriendsList

    public notifyCreaterUpdateList = (data) => {
        this.socket.emit('notify-creater-list-updated', data);
    }; // end of notifyCreater

    public notifyFriendsUpdateList = (data) => {
        this.socket.emit('notify-friends-list-updated', data);
    }; // end of notifyCreater

    public notifyCreaterEditedList = (data) => {
        this.socket.emit('notify-creater-list-edited', data);
    }; // end of notifyCreater

    public notifyFriendsrEditedList = (data) => {
        this.socket.emit('notify-friends-list-edited', data);
    }; // end of notifyCreater

    public notifyCreaterDeletedList = (data) => {
        this.socket.emit('notify-creater-list-deleted', data);
    }; // end of notifyCreater

    public notifyFriendsDeletedList = (data) => {
        this.socket.emit('notify-friends-list-deleted', data);
    }; // end of notifyCreater

    public listeningToOwnUserId = (userId) => {
        let listen = Observable.create((observer) => {
            this.socket.on(userId, (data) => {
                console.log("Received data from userId");
                observer.next(data);

            });
        });
        return listen;
    }; // end of sendRequestAck

    public authError = () => {
        let listen = Observable.create((observer) => {
            this.socket.on('auth-error', (err) => {
                console.log("Received data from auth-error event");
                observer.next(err);
            });
        });
        return listen;
    }; // end of authError


}