import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { NSProfileDataV2 } from '../models/profile-v2.model'
// tslint:disable
import _ from 'lodash'
// tslint:enable
import { map } from 'rxjs/operators'

const PROTECTED_SLAG_V8 = '/apis/protected/v8'

const API_END_POINTS = {
  DISCUSS_PROFILE: '/apis/protected/v8/discussionHub/users',
  PROFILE_DETAIL: `${PROTECTED_SLAG_V8}/social/post/timeline`,
  SOCIAL_VIEW_CONVERSATION: `${PROTECTED_SLAG_V8}/social/post/viewConversation`,
  // getUserdetailsV2FromRegistry: '/apis/protected/v8/user/profileRegistry/getUserRegistryByUser',
  getUserdetailsV2FromRegistry: '/apis/proxies/v8/api/user/v2/read',
}

@Injectable({
  providedIn: 'root',
})
export class ProfileV2Service {
  constructor(private http: HttpClient) { }
  fetchDiscussProfile(wid: string): Observable<any> {
    return this.http.get<any>(`${API_END_POINTS.DISCUSS_PROFILE}/${wid}`)
  }
  fetchProfile(userId: string): Observable<NSProfileDataV2.IProfile> {
    return this.http.get<NSProfileDataV2.IProfile>(`${API_END_POINTS.getUserdetailsV2FromRegistry}/${userId}`)
      .pipe(map(res => {
        // const roles = _.map(_.get(res, 'result.response.roles'), 'role')
        // _.set(res, 'result.response.roles', roles)
        return res
      }))

  }
  fetchPost(request: any): Observable<any> {
    return this.http.post<any>(API_END_POINTS.SOCIAL_VIEW_CONVERSATION, request)
  }

}
