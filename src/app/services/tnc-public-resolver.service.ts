import { Injectable } from '@angular/core'
import { Resolve } from '@angular/router'
import { Observable, of } from 'rxjs'
import { map, catchError } from 'rxjs/operators'
import { HttpClient } from '@angular/common/http'
import { NsTnc } from '../models/tnc.model'
import { IResolveResponse } from '@sunbird-cb/utils'

@Injectable()
export class TncPublicResolverService implements Resolve<Observable<IResolveResponse<NsTnc.ITnc>> | IResolveResponse<NsTnc.ITnc>> {

  constructor(
    private http: HttpClient,
  ) { }

  resolve(): Observable<IResolveResponse<NsTnc.ITnc>> {
    return this.getPublicTnc().pipe(
      map(data => ({ data, error: null })),
      catchError(error => of({ error, data: null })),
    )
  }
  getPublicTnc(locale?: string): Observable<NsTnc.ITnc> {
    let url = '/apis/public/v8/tnc'
    if (locale) {
      url += `?locale=${locale}`
    }
    return this.http.get<NsTnc.ITnc>(url)
  }
}
