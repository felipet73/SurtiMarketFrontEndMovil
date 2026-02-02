import { TestBed } from '@angular/core/testing';

import { WeeklyQuiz } from './weekly-quiz';

describe('WeeklyQuiz', () => {
  let service: WeeklyQuiz;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WeeklyQuiz);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
