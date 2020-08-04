import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserConfigModalComponent } from './user-config-modal.component';

describe('UserConfigModalComponent', () => {
  let component: UserConfigModalComponent;
  let fixture: ComponentFixture<UserConfigModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserConfigModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserConfigModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
