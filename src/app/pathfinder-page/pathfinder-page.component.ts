import { Component, OnInit } from '@angular/core';
import { PathfinderService } from '../services/pathfinder.service';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { catchError } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

interface Node {
  id: number;
  name: string;
  nearestToStartName: string | null;
}

interface UsedTag {
  id?: number;
  ID: string;
  TagName?: string; // Aktualisiert zu TagName
  TagId?: string; // Optional, da möglicherweise nicht vom Server gesendet
}

@Component({
  selector: 'app-pathfinder-page',
  templateUrl: './pathfinder-page.component.html',
  styleUrls: ['./pathfinder-page.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatListModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatRadioModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule
  ]
})
export class PathfinderPageComponent implements OnInit {
  list1: Node[] = [];
  list2: UsedTag[] = [];
  list3: any[] = [];
  pictureUrl: SafeUrl | null = null;
  selectedViewOption: string = 'all';
  currentUrl: string = '';
  selectedTag: UsedTag | null = null;

  constructor(
    private pathfinderService: PathfinderService,
    private sanitizer: DomSanitizer
  ) {}

  async ngOnInit() {
    console.log('PathfinderPage initializing...');
    
    await this.pathfinderService.getList2().pipe(
      catchError(error => {
        console.error('Error loading list2:', error);
        return [];
      })
    ).toPromise().then(data => {
      console.log('List2 raw data received:', JSON.stringify(data, null, 2));
      if (Array.isArray(data)) {
        console.log('First item in list2:', JSON.stringify(data[0], null, 2));
        console.log('Available properties:', data[0] ? Object.keys(data[0]) : []);
        console.log('Number of items in list2:', data.length);
      }
      this.list2 = data || [];
      console.log('Processed list2 data:', this.list2);
    });

    this.loadPicture();
    this.loadOtherLists();
  }

  private loadOtherLists() {
    this.pathfinderService.getList1().pipe(
      catchError(error => {
        console.error('Error loading list1:', error);
        return [];
      })
    ).subscribe(data => this.list1 = data);

    this.pathfinderService.getList3().pipe(
      catchError(error => {
        console.error('Error loading list3:', error);
        return [];
      })
    ).subscribe(data => this.list3 = data);
  }

  loadPicture() {
    try {
      console.log('LoadPicture - Current state:', {
        viewOption: this.selectedViewOption,
        selectedTag: this.selectedTag
      });

      const url = this.pathfinderService.getPictureUrl(
        this.selectedViewOption as 'all' | 'used' | 'selected',
        this.selectedTag?.ID
      );

      console.log('Generated URL:', url);
      this.currentUrl = url;

      this.pathfinderService.getPictureFromUrl(url).pipe(
        catchError(error => {
          console.error('Error loading picture:', error);
          return [];
        })
      ).subscribe({
        next: (blob) => {
          console.log('Picture received, size:', blob.size);
          const url = URL.createObjectURL(blob);
          this.pictureUrl = this.sanitizer.bypassSecurityTrustUrl(url);
        },
        error: (error) => {
          console.error('Error in picture subscription:', error);
        }
      });
    } catch (error) {
      console.error('Error in loadPicture:', error);
      this.currentUrl = 'Error: ' + (error instanceof Error ? error.message : 'Unknown error');
    }
  }

  startProcess(processNumber: number) {
    this.pathfinderService.startProcess(processNumber).subscribe(() => {
      this.loadPicture();
    });
  }

  getFilteredList1(): Node[] {
    return this.list1.filter(node => node.nearestToStartName !== null && node.nearestToStartName.trim() !== '');
  }

  onViewOptionChange() {
    console.log('View option changed to:', this.selectedViewOption);
    this.loadPicture();
  }

  onTagClick(tag: UsedTag) {
    this.selectedTag = tag;
    this.selectedViewOption = 'selected';
    this.loadPicture();
  }

  trackById(index: number, item: any): number {
    return item.id || index;
  }

  trackByIndex(index: number): number {
    return index;
  }
}
