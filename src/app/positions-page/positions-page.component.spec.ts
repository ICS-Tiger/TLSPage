import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PositionsPageComponent } from './positions-page.component';

describe('PositionsPageComponent', () => {
  let component: PositionsPageComponent;
  let fixture: ComponentFixture<PositionsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PositionsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PositionsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
