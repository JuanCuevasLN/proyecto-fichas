import { TestBed } from '@angular/core/testing';

import { FichasServiceService } from './fichas-service.service';

describe('FichasServiceService', () => {
  let service: FichasServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FichasServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
