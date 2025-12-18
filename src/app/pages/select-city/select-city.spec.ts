import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectCity } from './select-city';

describe('SelectCity', () => {
    let component: SelectCity;
    let fixture: ComponentFixture<SelectCity>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SelectCity]
        })
            .compileComponents();

        fixture = TestBed.createComponent(SelectCity);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
