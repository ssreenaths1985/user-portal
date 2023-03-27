
import { Component, OnInit, OnDestroy } from '@angular/core'
import { Router, Event, NavigationEnd, ActivatedRoute } from '@angular/router'
import { ValueService, ConfigurationsService } from '@sunbird-cb/utils'
import { map } from 'rxjs/operators'
import { NsWidgetResolver } from '@sunbird-cb/resolver'

/* tslint:disable */
import _ from 'lodash'
/* tslint:enable */

@Component({
  selector: 'app-profile-v2',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  /* tslint:disable */
  host: { class: 'margin-top-l' },
  /* tslint:enable */
})
export class ProfileComponent implements OnInit, OnDestroy {
  sideNavBarOpened = true
  panelOpenState = false
  titles = [{ title: 'NETWORK', url: '/app/network-v2', icon: 'group' }]
  unread = 0
  currentRoute = 'home'
  banner!: NsWidgetResolver.IWidgetData<any>
  private bannerSubscription: any
  public screenSizeIsLtMedium = false
  isLtMedium$ = this.valueSvc.isLtMedium$
  mode$ = this.isLtMedium$.pipe(map(isMedium => (isMedium ? 'over' : 'side')))
  userRouteName = ''
  private defaultSideNavBarOpenedSubscription: any
  constructor(private valueSvc: ValueService, private router: Router,
              private activeRoute: ActivatedRoute,
              private configSvc: ConfigurationsService) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.bindUrl(event.urlAfterRedirects.replace('/app/discuss/', ''))

        if (event.urlAfterRedirects === '/app/person-profile/me') {
          if (this.configSvc.userProfile) {
            this.userRouteName = `${this.configSvc.userProfile.firstName} ${this.configSvc.userProfile.lastName}`
            this.titles = [{ title: 'NETWORK', url: '/app/network-v2', icon: 'group' }]
            if (this.userRouteName && this.userRouteName.trim()) {
              this.titles.push({
                icon: '',
                title: `${this.userRouteName}\'profile`,
                url: 'none',
              })
            }
          }
        } else {
          if (this.activeRoute.firstChild) {
            this.activeRoute.firstChild.data.subscribe(response => {
              this.userRouteName = response && response.profile && response.profile.data && response.profile.data[0]
                && response.profile.data[0].personalDetails &&
                `${(response.profile.data[0].personalDetails.firstname || '')} ${(response.profile.data[0].personalDetails.surname)}`
            })
            this.titles = [{ title: 'NETWORK', url: '/app/network-v2', icon: 'group' }]
            if (this.userRouteName && this.userRouteName.trim()) {
              this.titles.push({
                icon: '',
                title: `${this.userRouteName}\'profile`,
                url: 'none',
              })
            }
          }
        }
      }
    })
  }

  ngOnInit() {
    this.defaultSideNavBarOpenedSubscription = this.isLtMedium$.subscribe(isLtMedium => {
      this.sideNavBarOpened = !isLtMedium
      this.screenSizeIsLtMedium = isLtMedium
    })
  }

  bindUrl(path: string) {
    if (path) {
      this.currentRoute = path
    }
  }

  ngOnDestroy() {
    if (this.defaultSideNavBarOpenedSubscription) {
      this.defaultSideNavBarOpenedSubscription.unsubscribe()
    }
    if (this.bannerSubscription) {
      this.bannerSubscription.unsubscribe()
    }
  }

}
