import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PuzzleModalPage } from './puzzle-modal.page';

describe('PuzzleModalPage', () => {
  let component: PuzzleModalPage;
  let fixture: ComponentFixture<PuzzleModalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PuzzleModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
