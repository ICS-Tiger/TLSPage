import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

interface Node {
  id: number;
  name: string;
  nearestToStartName: string | null;
  // ... other properties if needed
}

interface UsedTag {
  id: number;
  tagName: string;
  // add other properties if needed
}

export interface TagPoint {
  id: number;
  type: number;
  name: string;
  zone: string;
  radius: number;
  colorString: string;
  io: number;
}

@Injectable({
  providedIn: 'root'
})
export class PathfinderService {
  private apiUrl = 'https://wms-pathfinder-api.azurewebsites.net/api';
  private interval = 1000; // 1 second default

  constructor(private http: HttpClient) { }

  getList1(): Observable<Node[]> {
    return this.http.get<Node[]>(`${this.apiUrl}/Nodes`);
  }

  getList2(): Observable<UsedTag[]> {
    return this.http.get<UsedTag[]>(`${this.apiUrl}/UsedTag`);
  }

  getList3(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/list3`);
  }

  getPicture(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/GetPicture/GetRawPicture`, { responseType: 'blob' });
  }

  startProcess(processNumber: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/start/${processNumber}`, {});
  }

  getPositions(): Observable<TagPoint[]> {
    const url = `${this.apiUrl}/Positions/GetTags`;
    console.log('Fetching positions from:', url);
    return this.http.get<TagPoint[]>(url).pipe(
      map(response => {
        console.log('Raw API response:', response);
        return response;
      })
    );
  }

  getMapImage(dummy: number): Observable<Blob> {
    const url = `${this.apiUrl}/GetPicture/GetRawPicture?dummy=${dummy}`;
    console.log('Fetching map image from:', url);
    return this.http.get(url, { responseType: 'blob' });
  }

  getTypeString(tType: number, io: number): string {
    return tType === 2 ? io !== 0 ? "forkliftused.gif" : "forkliftfree.gif" : "palette.svg";
  }

  getTypeIcon(tType: number): string {
    return tType === 2 ? "fas fa-dot-circle" : "far fa-square";
  }

  getTypeText(tType: number, name: string): string {
    return tType === 2 ? `Stapler ${name}` : `Palette ${name}`;
  }

  getColorStyle(colorString: string): string {
    return `color: ${colorString};`;
  }
}
