import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap, catchError, withLatestFrom } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';

import { CoursesService } from '../../courses/services/courses/courses.service';

import * as fromCourses from '../reducers/courses';

import * as CoursesActions from '../actions/courses';

@Injectable()
export class CoursesEffects {
  constructor(
    private store: Store<fromCourses.State>,
    private actions$: Actions,
    private coursesService: CoursesService,
  ) {}

  fetchCourses$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CoursesActions.FetchCourses),
      switchMap(({ query }) => this.coursesService.getCourses(query)),
      map((courses) => CoursesActions.FetchCoursesSuccess({ courses })),
      // catchError(err= > console.log(err)),
    ),
  );

  fetchCourse$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CoursesActions.FetchCourse),
      switchMap(({ id }) => this.coursesService.getCourse(id)),
      map((course) => CoursesActions.FetchCoursesSuccess({ courses: [course] })),
      // catchError(err= > console.log(err)),
    ),
  );

  fetchAuthors$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CoursesActions.FetchAuthors),
      switchMap(() => this.coursesService.getAuthors()),
      map((authors) => CoursesActions.FetchAuthorsSuccess({ authors })),
      // catchError(err= > console.log(err)),
    ),
  );

  addNewCourse$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CoursesActions.AddNewCourse),
      switchMap(({ course }) => this.coursesService.addCourse(course)),
      withLatestFrom(
        this.store.pipe(select(fromCourses.getSearchTerm)),
        this.store.pipe(select(fromCourses.getSortField)),
        this.store.pipe(select(fromCourses.getCoursesCount)),
      ),
      map(([searchTerm, sortField, coursesCount]) => {
        const query = `start=0&count=${coursesCount}` +
          (searchTerm !== '' ? `&textFragment=${searchTerm}` : ``) +
          (sortField !== '' ? `&sort=${sortField}` : ``);

        return CoursesActions.FetchCourses({ query });
      }),
    ),
  );

  updateCourse$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CoursesActions.UpdateCourse),
      switchMap(({ course }) => this.coursesService.updateCourse(course)),
      withLatestFrom(
        this.store.pipe(select(fromCourses.getSearchTerm)),
        this.store.pipe(select(fromCourses.getSortField)),
        this.store.pipe(select(fromCourses.getCoursesCount)),
      ),
      map(([searchTerm, sortField, coursesCount]) => {
        const query = `start=0&count=${coursesCount}` +
          (searchTerm !== '' ? `&textFragment=${searchTerm}` : ``) +
          (sortField !== '' ? `&sort=${sortField}` : ``);

        return CoursesActions.FetchCourses({ query });
      }),
    ),
  );

  removeCourse$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CoursesActions.RemoveCourse),
      switchMap(({ id }) => this.coursesService.deleteCourse(id)),
      withLatestFrom(
        this.store.pipe(select(fromCourses.getSearchTerm)),
        this.store.pipe(select(fromCourses.getSortField)),
        this.store.pipe(select(fromCourses.getCoursesCount)),
      ),
      map(([searchTerm, sortField, coursesCount]) => {
        const query = `start=0&count=${coursesCount}` +
          (searchTerm !== '' ? `&textFragment=${searchTerm}` : ``) +
          (sortField !== '' ? `&sort=${sortField}` : ``);

        return CoursesActions.FetchCourses({ query });
      }),
    ),
  );
}
