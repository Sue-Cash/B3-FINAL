import { Component, OnInit }    from '@angular/core';
import { CommonModule }         from '@angular/common';
import { RouterModule }         from '@angular/router';
import { ObjectiveService }     from '../../../services/objective.service';
import { Objective }            from '../../../models/objective.model';
import { catchError }           from 'rxjs/operators';
import { of }                   from 'rxjs';

@Component({
  selector: 'app-list-objective',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './list-objective.html',
  styleUrls:   ['./list-objective.scss']
})
export class ListObjective implements OnInit {
  objectives: Objective[] = [];
  loading    = true;
  errorMsg?: string;

  constructor(private service: ObjectiveService) {}

  ngOnInit() {
    this.service.getObjectives()
      .pipe(
        catchError(err => {
          this.errorMsg = 'Erreur chargement des objectifs';
          console.error(err);
          return of([]);
        })
      )
      .subscribe(list => {
        this.objectives = list;
        this.loading    = false;
      });
  }
}
