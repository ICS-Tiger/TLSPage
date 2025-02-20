import { Component, OnInit } from '@angular/core';
import { PathfinderService } from '../services/pathfinder.service';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { catchError } from 'rxjs';

interface Node {
  id: number;
  name: string;
  nearestToStartName: string | null;
}

interface UsedTag {
  id: number;
  tagName: string;
}

@Component({
  selector: 'app-pathfinder-page',
  templateUrl: './pathfinder-page.component.html',
  styleUrls: ['./pathfinder-page.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class PathfinderPageComponent implements OnInit {
  list1: Node[] = [];
  list2: UsedTag[] = [];
  list3: any[] = [];
  pictureUrl: SafeUrl | null = null;

  constructor(
    private pathfinderService: PathfinderService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    console.log('PathfinderPage initializing...');
    this.loadLists();
    this.loadPicture();
  }

  loadLists() {
    console.log('Loading lists...');
    this.pathfinderService.getList1().pipe(
      catchError(error => {
        console.error('Error loading list1:', error);
        return [];
      })
    ).subscribe(data => {
      console.log('List1 data received:', data);
      this.list1 = data;
    });

    this.pathfinderService.getList2().pipe(
      catchError(error => {
        console.error('Error loading list2:', error);
        return [];
      })
    ).subscribe(data => {
      console.log('List2 data received:', data);
      this.list2 = data;
    });

    this.pathfinderService.getList3().pipe(
      catchError(error => {
        console.error('Error loading list3:', error);
        return [];
      })
    ).subscribe(data => {
      console.log('List3 data received:', data);
      this.list3 = data;
    });
  }

  loadPicture() {
    console.log('Loading picture...');
    this.pathfinderService.getPicture().pipe(
      catchError(error => {
        console.error('Error loading picture:', error);
        return [];
      })
    ).subscribe(blob => {
      console.log('Picture data received');
      const url = URL.createObjectURL(blob);
      this.pictureUrl = this.sanitizer.bypassSecurityTrustUrl(url);
    });
  }

  startProcess(processNumber: number) {
    this.pathfinderService.startProcess(processNumber).subscribe(() => {
      // Reload picture after starting process
      this.loadPicture();
    });
  }
}
