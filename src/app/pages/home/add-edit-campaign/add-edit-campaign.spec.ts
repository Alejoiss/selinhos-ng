import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditCampaign } from './add-edit-campaign';

describe('AddEditCampaign', () => {
  let component: AddEditCampaign;
  let fixture: ComponentFixture<AddEditCampaign>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditCampaign]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditCampaign);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
