import { Routes } from '@angular/router';
import { PathfinderPageComponent } from './pathfinder-page/pathfinder-page.component';
import { PositionsPageComponent } from './positions-page/positions-page.component';

export const routes: Routes = [
  { path: '', redirectTo: '/pathfinder', pathMatch: 'full' },
  { path: 'pathfinder', component: PathfinderPageComponent },
  { path: 'positions', component: PositionsPageComponent }
];
