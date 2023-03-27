import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, Resolve } from '@angular/router'

import { Observable, forkJoin, of } from 'rxjs'
// import { tap } from 'rxjs/operators'
// import { AuthInitService } from '@ws/author/src/lib/services/init.service'

@Injectable()
export class InitResolver implements Resolve<any> {
  constructor(
    // private ckEditorInject: CKEditorService,
  ) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const forkProcess: Observable<any>[] = [of(undefined)]
    // const pushedJobs: string[] = ['']
    const data: string[] = route.data ? route.data.load || [] : []

    if (data.includes('ckeditor')) {
      // forkProcess.push(this.ckEditorInject.inject())
      // forkProcess.push(this.zipJSInject.inject())
    }
    return forkJoin(forkProcess).pipe()
    // tap(v => {
    // if (pushedJobs.includes('config')) {
    //   this.authInitService.ownerDetails = v[pushedJobs.indexOf('config')].ownerDetails
    // }
    // })
    // ),
    // catchError((v: any) => {
    //   this.router.navigateByUrl('/error-somethings-wrong')
    //   return of(v)
    // }),

  }
}
