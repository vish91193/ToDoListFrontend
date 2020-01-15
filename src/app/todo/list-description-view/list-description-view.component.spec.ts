import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDescriptionViewComponent } from './list-description-view.component';

describe('ListDescriptionViewComponent', () => {
    let component: ListDescriptionViewComponent;
    let fixture: ComponentFixture<ListDescriptionViewComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ListDescriptionViewComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ListDescriptionViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});