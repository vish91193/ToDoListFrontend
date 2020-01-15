import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeViewComponent } from './home-view/home-view.component';
import { ListDescriptionViewComponent } from './list-description-view/list-description-view.component';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { SocketService } from '../socket.service';
import { UserDetailsComponent } from './user-details/user-details.component';
import { SomethingWentWrongComponent } from './something-went-wrong/something-went-wrong.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { TodoListRouteGaurdService } from './todo-list-route-gaurd.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        BrowserAnimationsModule, // required animations module
        NgxSpinnerModule,
        ToastrModule.forRoot(),
        RouterModule.forChild([
            { path: 'home/:userId', component: HomeViewComponent, canActivate: [TodoListRouteGaurdService] },
            { path: 'description/:listId', component: ListDescriptionViewComponent, canActivate: [TodoListRouteGaurdService] },
            { path: '', component: SomethingWentWrongComponent }
        ])
    ],
    declarations: [HomeViewComponent, ListDescriptionViewComponent, UserDetailsComponent, SomethingWentWrongComponent],
    providers: [SocketService, TodoListRouteGaurdService]

})
export class TodoModule { }