import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoChats } from './no-chats';

describe('NoChats', () => {
  let component: NoChats;
  let fixture: ComponentFixture<NoChats>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoChats]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoChats);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
