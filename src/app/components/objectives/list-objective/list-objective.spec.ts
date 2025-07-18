import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListObjective } from './list-objective';

describe('ListObjective', () => {
  let component: ListObjective;
  let fixture: ComponentFixture<ListObjective>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListObjective]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListObjective);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
