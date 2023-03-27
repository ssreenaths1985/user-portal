import { Component, HostBinding, Input, OnInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { NsWidgetResolver, WidgetBaseComponent } from '@sunbird-cb/resolver'
import { ConfigurationsService } from '@sunbird-cb/utils'

// import { ActivitiesService } from '@ws/app/src/lib/routes/activities/services/activities.service'
// import { IActivity, IActivityCard, IChallenges } from '@ws/app/src/lib/routes/activities/interfaces/activities.model'
// import { MatSnackBar } from '@angular/material'

@Component({
  selector: 'ws-widget-card-learn',
  templateUrl: './card-learn.component.html',
  styleUrls: ['./card-learn.component.scss'],
})
export class CardLearnComponent extends WidgetBaseComponent
  implements OnInit, NsWidgetResolver.IWidgetData<any> {

  @Input() widgetData: any
  givenName: string | undefined
  userEmail: string | undefined
  // activityCards: IActivityCard[] = []
  // challenges: IChallenges[] = []
  activityCards: any[] = []
  challenges: any[] = []
  isNewUser = false
  showActivities = false
  keyTag: string[] = []
  exploreBtns = []
  @HostBinding('id')
  public id = 'w-card-learn'
  constructor(
    private configSvc: ConfigurationsService,
    private router: Router,
    private activateroute: ActivatedRoute,
    // private activitiesSvc: ActivitiesService,
    // private snackBar: MatSnackBar,
  ) {
    super()
    if (this.configSvc.userProfile) {
      this.givenName = this.configSvc.userProfile.givenName
      this.userEmail = this.configSvc.userProfile.email
    }
    this.isNewUser = this.configSvc.isNewUser
    if (this.configSvc.restrictedFeatures) {
      if (this.configSvc.restrictedFeatures.has('activities')) {
        this.showActivities = false
      } else {
        this.showActivities = true
      }
    } else {
      this.showActivities = false
    }

  }
  hasRole(role: string[]): boolean {
    let returnValue = false
    role.forEach(v => {
      const rolesList = (this.configSvc.userRoles || new Set())
      if (rolesList.has(v.toLowerCase()) || rolesList.has(v.toUpperCase())) {
        returnValue = true
      }
    })
    return returnValue
  }
  ngOnInit() {
    if (
      this.activateroute.snapshot.parent
      && this.activateroute.snapshot.parent.data
      && this.activateroute.snapshot.data.pageData
      && this.activateroute.snapshot.data.pageData.data
      && this.activateroute.snapshot.data.pageData.data.ExploreButtons
    ) {
      this.exploreBtns = this.activateroute.snapshot.data.pageData.data.ExploreButtons
    }
    if (this.showActivities) {
      // this.activitiesSvc.fetchLearnActivites().then((result: IActivity) => {
      //   if (result.activities.length !== 0) {
      //     result.activities.forEach(activity => {
      //       if (activity.hasRole.length === 0 || this.hasRole(activity.hasRole)) {
      //         this.activityCards.push(activity)
      //       }
      //     })
      //     // this.activityCards = result.activities
      //     this.activityCards.forEach(activityCard => {
      //       if (!(this.keyTag.includes(activityCard.tag))) {
      //         this.keyTag.push(activityCard.tag)
      //       }
      //     })
      //     this.keyTag.forEach(tag => {
      //       const filteredActivity = this.activityCards.filter(activity => (tag === activity.tag))
      //       this.challenges.push({ tag, activities: filteredActivity })
      //     })
      //   } else {
      //     this.showActivities = false
      //   }
      // }).catch(() => {
      //   this.showActivities = false
      //   this.snackBar.open('Failed to load activities', 'X')
      // })
    }
  }

  allActivities() {
    this.router.navigate(['app', 'activities'])
  }

}
