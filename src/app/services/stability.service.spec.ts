import { TestBed } from '@angular/core/testing';

import { StabilityService } from './stability.service';

describe('StabilityService', () => {
  let service: StabilityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StabilityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
