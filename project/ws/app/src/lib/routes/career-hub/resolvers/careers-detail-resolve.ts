import { Injectable } from '@angular/core'
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'
import { Observable, of } from 'rxjs'
import { map, catchError } from 'rxjs/operators'
import { } from '@sunbird-cb/collection'
import { IResolveResponse } from '@sunbird-cb/utils'
import { DiscussService } from '../../discuss/services/discuss.service'
import { NSDiscussData } from '../../discuss/models/discuss.model'

@Injectable()
export class CareerDetailResolve
  implements
  Resolve<Observable<IResolveResponse<NSDiscussData.IDiscussionData>> | IResolveResponse<NSDiscussData.IDiscussionData>> {
  constructor(private discussionSvc: DiscussService) { }

  resolve(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot,
  ): Observable<IResolveResponse<NSDiscussData.IDiscussionData>> {
    const topicId = _route.params.topicId
    const topicName = _route.params.topicName
    return this.discussionSvc.fetchTopicById(topicId, topicName).pipe(
      map(data => ({ data, error: null })),
      catchError(error => of({ error, data: null })),
    )
  }
}
