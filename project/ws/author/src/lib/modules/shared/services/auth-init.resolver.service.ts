import { INIT } from '@ws/author/src/lib/constants/apiEndpoints'
import { Injectable } from '@angular/core'
import { Resolve } from '@angular/router'
import { Observable } from 'rxjs'
import { ApiService } from './api.service'
import { AccessControlService } from './access-control.service'

@Injectable({
  providedIn: 'root',
})
export class AuthInitResolver implements Resolve<any> {

  constructor(
    private svc: ApiService,
    private accessService: AccessControlService,
  ) {
  }

  resolve(): Observable<any> {
    return this.svc.get(
      `${INIT}${this.accessService.orgRootOrgAsQuery}&lang=${this.accessService.locale}`,
    )
  }
}
