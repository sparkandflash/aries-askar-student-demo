import { TestBed } from '@angular/core/testing';

import { InformationTsService } from './information.ts.service';

describe('InformationTsService', () => {
  let service: InformationTsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InformationTsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
