import { Injectable  } from '@angular/core'
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router'
import { Observable, of } from 'rxjs'
import { NsInstanceConfig, ConfigurationsService, IResolveResponse } from '@sunbird-cb/utils'

@Injectable()
export class ConfigResolverService implements Resolve<Observable<NsInstanceConfig.IConfig>> {

  constructor(private configSvc: ConfigurationsService) { }

  resolve(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<NsInstanceConfig.IConfig> {

    const result: IResolveResponse<NsInstanceConfig.IConfig> = {
      data: this.configSvc.instanceConfig,
      error: null,
    }
    return of(result)
  }
}
