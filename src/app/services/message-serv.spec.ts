import { TestBed } from '@angular/core/testing';

import { MessageServ } from './message-serv';

describe('MessageServ', () => {
  let service: MessageServ;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MessageServ);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
