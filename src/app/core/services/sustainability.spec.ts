import { TestBed } from '@angular/core/testing';

import { Sustainability } from './sustainability';

describe('Sustainability', () => {
  let service: Sustainability;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Sustainability);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
