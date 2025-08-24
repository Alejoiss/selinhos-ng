import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterStamp } from './register-stamp';

describe('RegisterStamp', () => {
  let component: RegisterStamp;
  let fixture: ComponentFixture<RegisterStamp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterStamp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterStamp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
