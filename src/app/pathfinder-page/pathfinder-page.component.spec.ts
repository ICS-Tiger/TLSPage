import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PathfinderPageComponent } from './pathfinder-page.component';

describe('PathfinderPageComponent', () => {
  let component: PathfinderPageComponent;
  let fixture: ComponentFixture<PathfinderPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PathfinderPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PathfinderPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
