import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// import { Cookie } from 'ng2-cookies/ng2-cookies';
import { AppService } from '../../app.service';
import { ToastrService } from 'ngx-toastr';
import { SocketService } from '../../socket.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'app-list-description-view',
    templateUrl: './list-description-view.component.html',
    styleUrls: ['./list-description-view.component.css']
})
export class ListDescriptionViewComponent implements OnInit {

    userInfo: any;
    authToken: any;
    userName: any;
    listId: any;
    list: any;
    newItem: any;
    newSubItem: any;
    parentId: any;
    notificationData: any = [];

    constructor(public router: Router, public appService: AppService, private _route: ActivatedRoute, private toastr: ToastrService, public socketService: SocketService, private spinner: NgxSpinnerService) { }

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
        // console.log(this.userName);
        this.listId = this._route.snapshot.paramMap.get('listId');
        console.log(this.listId);

        this.socketService.verifyUser().subscribe((data) => {
            this.socketService.setUser(this.authToken);
        });

        this.socketService.authError().subscribe((data) => {
            if (data.error == 'Token expired') {
                this.toastr.error("Session Expired!!");
                this.router.navigate(['/']);
            }
        });

        this.notificationALerts();

        this.socketService.getFriendsList(this.userInfo.userDetails.userId);

        this.socketService.listeningToOwnUserId(this.userInfo.userDetails.userId).subscribe((data) => {
            console.log(data);
            if (data.status === 'Request Notification') {
                this.toastr.success(data.data);
                this.notificationALerts();
            }
            // req already sent
            else if (data.status === 403) {
                this.toastr.warning(data.message);
            }
            else if (data.status === 'Request Accepted Notification') {
                // update friendsList()
                this.toastr.success(data.data);
            }
            else if (data.status === 'FriendsList') {
                console.log("FriendList!");
            }
            else if (data.status === 'Updated List') {
                // update friendsList()
                this.toastr.success(data.data);
                this.appService.getListByListId(this.listId, this.authToken).subscribe((apiResponse) => {
                    console.log(apiResponse);
                    if (apiResponse.status === 200) {
                        this.list = apiResponse.data;
                    }
                    else {
                        console.log("Some");
                    }
                });
            }
            else if (data.status === 'Edited List') {
                // update friendsList()
                this.toastr.success(data.data);
                this.appService.getListByListId(this.listId, this.authToken).subscribe((apiResponse) => {
                    console.log(apiResponse);
                    if (apiResponse.status === 200) {
                        this.list = apiResponse.data;
                    }
                    else if (apiResponse.status === 404) {
                        console.log(apiResponse.message)
                    }
                    else {
                        this.router.navigate(['/something-went-wrong']);
                    }
                });
            }
            else if (data.status === 'Deleted List') {
                this.toastr.success(data.data);
            }
            else {
                console.log("Error")
            }
        });

        this.appService.getListByListId(this.listId, this.authToken).subscribe((apiResponse) => {
            console.log(apiResponse);
            if (apiResponse.status === 200) {
                this.list = apiResponse.data;
            }
            else if (apiResponse.status === 404) {
                console.log(apiResponse.message)
            }
            else {
                this.router.navigate(['/something-went-wrong']);
            }
        });

    };

    setParentId = (id) => {
        this.parentId = id;
        console.log(this.parentId);
    }; // end of setParentId

    addNewItem = () => {
        let data = {
            listId: this.listId,
            itemName: this.newItem,
            parentId: this.listId,
            status: 'open',
            createdBy: this.userInfo.userDetails.userId
        };
        this.appService.createAItem(data, this.authToken).subscribe((apiResponse) => {
            console.log(apiResponse);
            if (apiResponse.status === 200) {
                window.document.getElementById('addItem').click();
                this.newItem = "";
                this.list = apiResponse.data;
                console.log(this.list);
                if (this.list.createdBy === this.userInfo.userDetails.userId) {
                    console.log("Notify friends");
                    let data = {
                        userId: this.userInfo.userDetails.userId,
                        userName: this.userName,
                        listName: this.list.listName
                    };
                    this.socketService.notifyFriendsUpdateList(data);
                }
                else {
                    console.log("Notify creater")
                    let data = {
                        createrId: this.list.createdBy,
                        updaterName: this.userName,
                        listName: this.list.listName
                    };

                    this.socketService.notifyCreaterUpdateList(data);


                }

            }
            else {
                this.toastr.error(apiResponse.message);
            }
        });
    }; // end of addNewItem

    addNewSubItem = () => {
        let data = {
            listId: this.listId,
            itemName: this.newSubItem,
            parentId: this.parentId,
            status: 'open',
            createdBy: this.userInfo.userDetails.userId
        };
        // console.log(data);
        this.appService.createAItem(data, this.authToken).subscribe((apiResponse) => {
            console.log(apiResponse);
            if (apiResponse.status === 200) {
                window.document.getElementById('addSubItem').click();
                this.newSubItem = "";
                this.list = apiResponse.data;
                console.log(this.list);
                if (this.list.createdBy === this.userInfo.userDetails.userId) {
                    console.log("Notify friends");
                    let data = {
                        userId: this.userInfo.userDetails.userId,
                        userName: this.userName,
                        listName: this.list.listName
                    };
                    this.socketService.notifyFriendsUpdateList(data);
                }
                else {
                    console.log("Notify creater")
                    let data = {
                        createrId: this.list.createdBy,
                        updaterName: this.userName,
                        listName: this.list.listName
                    };

                    this.socketService.notifyCreaterUpdateList(data);


                }
            }
            else {
                this.toastr.error(apiResponse.message);
            }
        });
    }; // end of addNewSubItem

    editList = () => {
        // console.log(this.list);
        this.appService.editAList(this.listId, this.list, this.authToken).subscribe((apiResponse) => {
            console.log(apiResponse);
            if (apiResponse.status === 200) {
                this.list = apiResponse.data;
                this.toastr.success("List edited successfully!!");
                if (this.list.createdBy === this.userInfo.userDetails.userId) {
                    console.log("Notify friends");
                    let data = {
                        userId: this.userInfo.userDetails.userId,
                        userName: this.userName,
                        listName: this.list.listName
                    };
                    this.socketService.notifyFriendsrEditedList(data);
                }
                else {
                    console.log("Notify creater")
                    let data = {
                        createrId: this.list.createdBy,
                        updaterName: this.userName,
                        listName: this.list.listName
                    };

                    this.socketService.notifyCreaterEditedList(data);


                }
            }
            else {
                this.toastr.error(apiResponse.message);
            }

        });
    }; // end of editList

    @HostListener('document:keyup', ['$event'])
    onKeyPress = (event) => {
        // console.log(event);
        if ((event.ctrlKey || event.metaKey) && event.code == 'KeyZ') {
            console.log("Undo!");
            this.undo();
        }
    }

    undo = () => {
        this.appService.undoAList(this.listId, this.authToken).subscribe((apiResponse) => {
            // console.log(apiResponse);
            if (apiResponse.status === 200) {
                this.list = apiResponse.data;
                console.log(this.list);
                if (this.list.createdBy === this.userInfo.userDetails.userId) {
                    console.log("Notify friends");
                    let data = {
                        userId: this.userInfo.userDetails.userId,
                        userName: this.userName,
                        listName: this.list.listName
                    };
                    this.socketService.notifyFriendsrEditedList(data);
                }
                else {
                    console.log("Notify creater")
                    let data = {
                        createrId: this.list.createdBy,
                        updaterName: this.userName,
                        listName: this.list.listName
                    };

                    this.socketService.notifyCreaterEditedList(data);


                }
            }
            else {
                this.toastr.error(apiResponse.message);
            }
        });
    }; // end of undo

    deleteList = () => {
        this.appService.deleteAList(this.listId, this.authToken).subscribe((apiResponse) => {
            console.log(apiResponse);
            if (apiResponse.status === 200) {
                this.toastr.success("List deleted successfully!!");
                this.router.navigate(['/home', this.userInfo.userDetails.userId]);
                if (this.list.createdBy === this.userInfo.userDetails.userId) {
                    console.log("Notify friends");
                    let data = {
                        userId: this.userInfo.userDetails.userId,
                        userName: this.userName,
                        listName: this.list.listName
                    };
                    this.socketService.notifyFriendsDeletedList(data);
                }
                else {
                    console.log("Notify creater")
                    let data = {
                        createrId: this.list.createdBy,
                        updaterName: this.userName,
                        listName: this.list.listName
                    };

                    this.socketService.notifyCreaterDeletedList(data);


                }
            }
            else {
                this.toastr.error(apiResponse.message);
            }
        });
    }; // end of deleteList

    deleteItem = (itemId) => {
        console.log(itemId);
        this.appService.deleteAItem(this.listId, itemId, this.authToken).subscribe((apiResponse) => {
            // console.log(apiResponse);
            if (apiResponse.status === 200) {
                this.list = apiResponse.data;
                console.log(this.list);
                if (this.list.createdBy === this.userInfo.userDetails.userId) {
                    console.log("Notify friends");
                    let data = {
                        userId: this.userInfo.userDetails.userId,
                        userName: this.userName,
                        listName: this.list.listName
                    };
                    this.socketService.notifyFriendsrEditedList(data);
                }
                else {
                    console.log("Notify creater")
                    let data = {
                        createrId: this.list.createdBy,
                        updaterName: this.userName,
                        listName: this.list.listName
                    };

                    this.socketService.notifyCreaterEditedList(data);


                }
            }
            else {
                this.toastr.error(apiResponse.message);
            }
        });
    }; // end of deleteItem

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

}