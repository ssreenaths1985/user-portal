import { Injectable } from '@angular/core'
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'
import { Observable, of } from 'rxjs'
import { map, catchError } from 'rxjs/operators'
import { } from '@sunbird-cb/collection'
import { IResolveResponse } from '@sunbird-cb/utils'
import { CompetenceAssessmentService } from '../services/comp-assessment.service'
// tslint:disable-next-line
import _ from 'lodash'

@Injectable()
export class AssessmentResolverService
    implements
    Resolve<Observable<IResolveResponse<any>> | IResolveResponse<any>> {
    constructor(private competenceSvc: CompetenceAssessmentService) { }

    resolve(
        route: ActivatedRouteSnapshot,
        _state: RouterStateSnapshot,
    ): Observable<IResolveResponse<any>> {
        const id = route.params['assessmentId']
        return this.competenceSvc.fetchAssessment(id).pipe(
            map((data: any) => ({ data: _.get(data, 'result.questionSet') || {}, error: null })),
            catchError(error => of({ error, data: null })),
        )
    }
}
