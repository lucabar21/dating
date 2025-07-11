import { TestBed } from '@angular/core/testing';

import { UserServ } from './user-serv';

describe('UserServ', () => {
  let service: UserServ;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserServ);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
