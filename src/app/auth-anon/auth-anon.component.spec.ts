import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthAnonComponent } from './auth-anon.component';

describe('AuthAnonComponent', () => {
  let component: AuthAnonComponent;
  let fixture: ComponentFixture<AuthAnonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthAnonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthAnonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
