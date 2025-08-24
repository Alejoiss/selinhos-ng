import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditProfile } from './add-edit-profile';

describe('AddEditProfile', () => {
    let component: AddEditProfile;
    let fixture: ComponentFixture<AddEditProfile>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AddEditProfile]
        })
            .compileComponents();

        fixture = TestBed.createComponent(AddEditProfile);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
