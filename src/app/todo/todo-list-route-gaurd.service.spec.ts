import { TestBed, inject } from '@angular/core/testing';

import { TodoListRouteGaurdService } from './todo-list-route-gaurd.service';

describe('TodoListRouteGaurdService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [TodoListRouteGaurdService]
        });
    });

    it('should be created', inject([TodoListRouteGaurdService], (service: TodoListRouteGaurdService) => {
        expect(service).toBeTruthy();
    }));
});