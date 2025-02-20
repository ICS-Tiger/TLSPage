import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

interface Node {
  id: number;
  name: string;
  nearestToStartName: string | null;
}

interface UsedTag {
  id?: number;  // Optional, da möglicherweise nicht vom Server gesendet
  ID: string;   // Dies ist das Hauptfeld, das vom Server kommt
  TagName?: string; // Korrigiertes Feld für den Tag-Namen
  TagId?: string;  // Die TagId für die Bildabfrage
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
  private list2Cache: UsedTag[] = [];

  constructor(private http: HttpClient) { }

  getList1(): Observable<Node[]> {
    return this.http.get<Node[]>(`${this.apiUrl}/Nodes`);
  }

  getList2(): Observable<UsedTag[]> {
    return this.http.get<any[]>(`${this.apiUrl}/UsedTag`).pipe(
      map(response => {
        console.log('Raw UsedTag response:', response);
        const tags = Array.isArray(response) ? response : [];
        this.list2Cache = tags.map(tag => {
          // Speichere die komplette Server-Antwort für Debugging
          console.log('Raw tag from server:', tag);
          
          const processedTag = {
            id: tag.id,
            ID: String(tag.id || ''),  // Verwende die numerische ID als String
            TagName: String(tag.TagName  || 'none'),
            TagId: String(tag.tagId ||   '000') // Originale TagId vom Server
          };
          console.log('Processed tag:', processedTag);
          return processedTag;
        });
        return this.list2Cache;
      })
    );
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

  getPictureFromUrl(url: string): Observable<Blob> {
    return this.http.get(url, { responseType: 'blob' });
  }

  getPictureUrl(type: 'all' | 'used' | 'selected', tagId?: string): string {
    console.log('getPictureUrl called with:', { type, tagId });
    
    switch (type) {
      case 'all':
        return `${this.apiUrl}/GetPicture/GetRawPicture`;
      case 'used':
        return `${this.apiUrl}/GetPicture/GetRawPictureForUsedBy1`;
      case 'selected':
        if (!tagId) {
          console.error('TagId is required for selected type');
          throw new Error('TagId is required for selected view');
        }

        // Suche in list2Cache nach dem Tag mit der passenden ID
        const foundTag = this.list2Cache.find(tag => tag.ID === tagId);
        console.log('Found tag in cache:', foundTag);

        // Verwende die originale TagId vom Server für den API-Aufruf
        if (foundTag && foundTag.TagId) {
          const cleanTagId = foundTag.TagId.trim();
          if (!cleanTagId) {
            throw new Error('TagId cannot be empty');
          }
          console.log('Using TagId for URL:', cleanTagId);
          return `${this.apiUrl}/GetPicture/GetRawPictureForOneTag${cleanTagId}?size=1000`;
        }
        
        return `${this.apiUrl}/GetPicture/GetRawPicture`;
      default:
        return `${this.apiUrl}/GetPicture/GetRawPicture`;
    }
  }
}
