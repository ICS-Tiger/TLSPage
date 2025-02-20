import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PathfinderService, TagPoint } from '../services/pathfinder.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { interval, Subscription, catchError } from 'rxjs';

@Component({
  selector: 'app-positions-page',
  templateUrl: './positions-page.component.html',
  styleUrls: ['./positions-page.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class PositionsPageComponent implements OnInit, OnDestroy {
  posList: TagPoint[] = [];
  imagePath: SafeUrl | null = null;
  private timerSubscription?: Subscription;
  private timerTicks = 0;
  private intervalInMsec = 1000;

  constructor(
    private pathfinderService: PathfinderService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.startTimer();
  }

  ngOnDestroy() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  private startTimer() {
    this.timerSubscription = interval(this.intervalInMsec).subscribe(() => {
      this.timerTicks++;
      this.loadData();
    });
    // Initial load
    this.loadData();
  }

  private loadData() {
    console.log('Loading positions data...');
    this.pathfinderService.getPositions().pipe(
      catchError(error => {
        console.error('Error loading positions:', error);
        return [];
      })
    ).subscribe(data => {
      console.log('Received positions data:', data);
      this.posList = data;
    });

    this.pathfinderService.getMapImage(this.timerTicks).pipe(
      catchError(error => {
        console.error('Error loading map image:', error);
        return [];
      })
    ).subscribe(blob => {
      console.log('Received map image blob:', blob);
      const url = URL.createObjectURL(blob);
      this.imagePath = this.sanitizer.bypassSecurityTrustUrl(url);
    });
  }

  getColorStyle(colorString: string): string {
    return this.pathfinderService.getColorStyle(colorString);
  }

  getTypeString(type: number, io: number): string {
    const typeString = this.pathfinderService.getTypeString(type, io);
    return '/assets/images/' + typeString;
  }

  getTypeIcon(type: number): string {
    return this.pathfinderService.getTypeIcon(type);
  }

  getTypeText(type: number, name: string): string {
    return this.pathfinderService.getTypeText(type, name);
  }
}
