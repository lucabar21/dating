import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedirectToLatestChat } from './redirect-to-latest-chat';

describe('RedirectToLatestChat', () => {
  let component: RedirectToLatestChat;
  let fixture: ComponentFixture<RedirectToLatestChat>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RedirectToLatestChat]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RedirectToLatestChat);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
