import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceholderCard } from './placeholder-card';

describe('PlaceholderCard', () => {
  let component: PlaceholderCard;
  let fixture: ComponentFixture<PlaceholderCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaceholderCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlaceholderCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
