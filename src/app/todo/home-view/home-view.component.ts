import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { AppService } from '../../app.service';
import { ToastrService } from 'ngx-toastr';
import { SocketService } from '../../socket.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'app-home-view',
    templateUrl: './home-view.component.html',
    styleUrls: ['./home-view.component.css']
})
export class HomeViewComponent implements OnInit {

    userInfo: any;
    authToken: any;
    userName: any;
    receiverId: any;
    receiverName: any;
    searchName: any;
    searchedFriend: any;
    userPrivateList: any = [];
    userPublicList: any = [];
    listName: any;
    possibleCategories = ['Yes', 'No'];
    privateCategory: any;
    notificationData: any = [];
    friendsList: any = [];

    constructor(public router: Router, public appService: AppService, private toastr: ToastrService, public socketService: SocketService, private spinner: NgxSpinnerService) { }

    ngOnInit() {

        /** spinner starts on init */
        this.spinner.show();

        setTimeout(() => {
            /** spinner ends after 3 seconds */
            this.spinner.hide();
        }, 3000);

        this.userInfo = this.appService.getUserInfoFromLocalStorage();
        console.log(this.userInfo);
        this.authToken = this.userInfo.authToken;
        // console.log(this.authToken);
        this.userName = this.userInfo.userDetails.fullName;
        console.log(this.userName);

        this.socketService.verifyUser().subscribe((data) => {
            this.socketService.setUser(this.authToken);
        });

        this.socketService.authError().subscribe((err) => {
            if (err.error == 'Token expired') {
                this.toastr.error("Session Expired!!");
                this.router.navigate(['/']);
            }
        });

        this.notificationALerts();

        this.socketService.getFriendsList(this.userInfo.userDetails.userId);

        this.socketService.listeningToOwnUserId(this.userInfo.userDetails.userId).subscribe((data) => {

            if (data.status === 'Request Notification') {
                this.notificationALerts();
                this.toastr.success(data.data);
            }
            // req already sent
            else if (data.status === 403) {
                this.toastr.warning(data.message);
            }
            else if (data.status === 'Requested successfully') {
                this.toastr.success(data.message);
            }
            else if (data.status === 'Request Accepted Notification') {
                // update friendsList()
                this.toastr.success(data.data);
                this.socketService.getFriendsList(this.userInfo.userDetails.userId);
            }
            else if (data.status === 'FriendsList') {
                this.friendsList = [];
                // console.log(data);
                for (let d in data.data) {
                    let temp = {
                        friendId: d,
                        friendName: data.data[d]
                    };

                    this.friendsList.push(temp);

                };
                console.log(this.friendsList);
            }
            else if (data.status === 'Updated List') {
                // update friendsList()
                this.toastr.success(data.data);
            }
            else if (data.status === 'Edited List') {
                // update friendsList()
                this.toastr.success(data.data);
            }
            else if (data.status === 'Deleted List') {
                this.toastr.success(data.data);
                this.appService.getAllPublicListOfAUser(this.userInfo.userDetails.userId, this.authToken).subscribe((apiResponse) => {
                    console.log(apiResponse);
                    if (apiResponse.status === 200) {
                        this.userPublicList = apiResponse.data;
                    }
                    else if (apiResponse.status === 404) {
                        this.userPublicList = [];
                        console.log("No public list");
                    }
                    else {
                        console.log("Some");
                    }
                });
            }
            else {
                console.log(data);
            }
        });

        this.appService.getAllPrivateListOfAUser(this.userInfo.userDetails.userId, this.authToken).subscribe((apiResponse) => {
            console.log(apiResponse);
            if (apiResponse.status === 200) {
                this.userPrivateList = apiResponse.data;
            }
            else if (apiResponse.status === 404) {
                console.log("No private list");
            }
            else {
                this.router.navigate(['/something-went-wrong']);
            }
        });

        this.appService.getAllPublicListOfAUser(this.userInfo.userDetails.userId, this.authToken).subscribe((apiResponse) => {
            console.log(apiResponse);
            if (apiResponse.status === 200) {
                this.userPublicList = apiResponse.data;
            }
            else if (apiResponse.status === 404) {
                console.log("No public list");
            }
            else {
                this.router.navigate(['/something-went-wrong']);
            }
        });

    };

    createAList = () => {
        let data = {
            listName: this.listName,
            private: this.privateCategory,
            createdBy: this.userInfo.userDetails.userId
        };
        console.log(data);
        this.appService.createAList(data, this.authToken).subscribe((apiResponse) => {
            console.log(apiResponse);
            if (apiResponse.status === 200) {
                window.document.getElementById('createList').click();
                this.toastr.success("List created successfully!!");
                this.listName = '';
                this.privateCategory = '';
                this.router.navigate(['/description', apiResponse.data.listId]);
            }
            else {
                this.toastr.error(apiResponse.message);
            }
        });
    }; // end of createAList

    searchFriend = () => {
        console.log(this.searchName);
        this.appService.searchFriend(this.searchName, this.authToken).subscribe((apiResponse) => {
            console.log(apiResponse);
            if (apiResponse.status === 200) {
                this.searchedFriend = apiResponse.data;
            }
            else {
                this.toastr.error(apiResponse.message);
            }
        });
    }; // end of searchFriend

    addFriend = (id, name) => {
        let data = {
            senderId: this.userInfo.userDetails.userId,
            senderName: this.userName,
            receiverId: id,
            receiverName: name
        };
        console.log(data);
        this.socketService.sendRequest(data);
    }; // end of addFriend

    notificationALerts = () => {
        this.appService.getNotification(this.userInfo.userDetails.userId, this.authToken).subscribe((apiResponse) => {
            console.log(apiResponse);
            if (apiResponse.status === 200) {
                this.notificationData = apiResponse.data;
            }
            else if (apiResponse.status === 404) {
                this.notificationData = [];
                console.log(apiResponse.message);
            }
            else {
                console.log(apiResponse.message);
            }
        });
    };

    acceptRequest = (data) => {
        data.status = 'friends';
        console.log(data);
        this.appService.updateRequest(data, this.authToken).subscribe((apiResponse) => {
            console.log(apiResponse);
            if (apiResponse.status === 200) {
                window.document.getElementById('notifications').click();
                this.notificationALerts();
                this.toastr.success("You both are friend's now");
                // send notifcation req accepted and save the friend in redis in both the userId
                this.socketService.requestAcceptedNotification(data);
                this.socketService.getFriendsList(this.userInfo.userDetails.userId);
            }
            else {
                this.toastr.error(apiResponse.message);
            }
        });
    }; // end of acceptRequest

    rejectRequest = (data) => {
        data.status = 'rejected';
        console.log(data);
        this.appService.updateRequest(data, this.authToken).subscribe((apiResponse) => {
            console.log(apiResponse);
            if (apiResponse.status === 200) {
                window.document.getElementById('notifications').click();
                this.notificationALerts();
                this.toastr.success("You rejected the friend request");
            }
            else {
                this.toastr.error(apiResponse.message);
            }
        });
    }; // end of rejectRequest

    getFriendsList = (friendDetails) => {
        console.log(friendDetails);
        this.appService.getAllPublicListOfAUser(friendDetails.friendId, this.authToken).subscribe((apiResponse) => {
            console.log(apiResponse);
            if (apiResponse.status === 200) {
                this.userPrivateList = [];
                this.userPublicList = [];
                this.userPublicList = apiResponse.data;
            }
            else if (apiResponse.status === 404) {
                this.toastr.warning(`Your friend ${friendDetails.friendName} does'nt have any public list to view!!`);
            }
            else {
                console.log("Some");
            }
        });


    }; // end of getFriendsList

    getOwnList = () => {
        this.userPrivateList = [];
        this.userPublicList = [];
        this.appService.getAllPrivateListOfAUser(this.userInfo.userDetails.userId, this.authToken).subscribe((apiResponse) => {
            console.log(apiResponse);
            if (apiResponse.status === 200) {
                this.userPrivateList = apiResponse.data;
            }
            else if (apiResponse.status === 404) {
                console.log("No private list");
            }
            else {
                console.log("Some");
            }
        });

        this.appService.getAllPublicListOfAUser(this.userInfo.userDetails.userId, this.authToken).subscribe((apiResponse) => {
            console.log(apiResponse);
            if (apiResponse.status === 200) {
                this.userPublicList = apiResponse.data;
            }
            else if (apiResponse.status === 404) {
                console.log("No public list");
            }
            else {
                console.log("Some");
            }
        });
    }; // end of getOwnList

    logout = () => {
        this.appService.logoutUser(this.userInfo.userDetails.userId, this.authToken).subscribe((apiResponse) => {
            console.log(apiResponse);
            if (apiResponse.status === 200) {
                Cookie.delete('authToken');
                Cookie.delete('receiverId');
                Cookie.delete('receiverName');
                // while logout we need to clear localstorage
                localStorage.clear();
                this.toastr.success('Logged out successfully!!');
                this.router.navigate(['/']);
            }
            else if (apiResponse.message === 'User logged out already or user not registered') {
                console.log(apiResponse.message);
                this.toastr.error(apiResponse.message);
                this.router.navigate(['/']);
            }
            else {
                console.log(apiResponse.message);
                this.toastr.error(apiResponse.message);
                this.router.navigate(['/']);
            }
        });
    }; // end of logout
}