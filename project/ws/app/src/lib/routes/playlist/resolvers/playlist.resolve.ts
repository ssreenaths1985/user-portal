import { Injectable } from '@angular/core'
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'

import { Observable, of } from 'rxjs'
import { map, catchError, first } from 'rxjs/operators'

import { IResolveResponse } from '@sunbird-cb/utils'
import { NsPlaylist, BtnPlaylistService } from '@sunbird-cb/collection'

@Injectable()
export class PlaylistResolve
  implements
  Resolve<
  | Observable<IResolveResponse<NsPlaylist.IPlaylist>>
  | IResolveResponse<NsPlaylist.IPlaylist>
  > {
  constructor(private playlistSvc: BtnPlaylistService) { }

  resolve(
    route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot,
  ): Observable<IResolveResponse<NsPlaylist.IPlaylist>> {
    return this.playlistSvc
      .getPlaylist(route.params.id)
      .pipe(
        first(),
        map(data => ({ data, error: null })),
        catchError(error => of({ error, data: null })),
      )
  }
}
