import { Injectable } from '@angular/core'
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router'
import { Observable, of } from 'rxjs'
import { ApiService } from '../modules/shared/services/api.service'
import { NSContent } from '../interface/content'
// import { CONTENT_READ_HIERARCHY_AND_DATA } from '../constants/apiEndpoints'
import { catchError } from 'rxjs/operators'

@Injectable()
export class ContentAndDataReadMultiLangTOCResolver implements Resolve<{ content: NSContent.IContentMetaV2, data: any }[]> {

  constructor(
    private apiService: ApiService,
    private router: Router,
  ) {
  }

  resolve(
    route: ActivatedRouteSnapshot,
  ): Observable<{ content: NSContent.IContentMetaV2, data: any }[]> {
    const id = route.params['id']
    return this.apiService.get<{ content: NSContent.IContentMetaV2, data: any }[]>(
      `/apis/authApi/content/v3/read/${id}?mode=edit`,
    ).pipe(
      catchError((v: any) => {
        this.router.navigateByUrl('/error-somethings-wrong')
        return of(v)
      }),
    )
  }
}
