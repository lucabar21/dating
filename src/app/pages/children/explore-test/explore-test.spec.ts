import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploreTest } from './explore-test';

describe('ExploreTest', () => {
  let component: ExploreTest;
  let fixture: ComponentFixture<ExploreTest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExploreTest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExploreTest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
