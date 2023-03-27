import { Component, OnInit, Input } from '@angular/core'
import { Router } from '@angular/router'
import { NSNetworkDataV2 } from '../../models/network-v2.model'
import { ConnectionHoverService } from '../connection-name/connection-hover.servive'

@Component({
  selector: 'ws-app-my-connection-card',
  templateUrl: './my-connection-card.component.html',
  styleUrls: ['./my-connection-card.component.scss'],
})
export class MyConnectionCardComponent implements OnInit {
  @Input() user!: NSNetworkDataV2.INetworkUser
  howerUser!: any
  unmappedUser!: any
  constructor(
    private router: Router,
    private connectionHoverService: ConnectionHoverService,
  ) { }

  ngOnInit() {
    const userId = this.user.id || this.user.identifier
    this.connectionHoverService.fetchProfile(userId).subscribe((res: any) => {
      if (res.profileDetails !== null) {
        this.howerUser = res.profileDetails
        this.unmappedUser = res
      } else {
        this.howerUser = res || {}
        this.unmappedUser = res
      }
      return this.howerUser
    })
  }

  goToUserProfile(user: any) {
    this.router.navigate(['/app/person-profile', (user.userId || user.id)])
    // this.router.navigate(['/app/person-profile'], { queryParams: { emailId: } })

  }

  getUseravatarName() {
     // if (this.user) {
    //   return `${this.user.personalDetails.firstname} ${this.user.personalDetails.surname}`
    // }
    // return ''
    let name = ''
    if (this.user && !this.user.personalDetails) {
      if (this.user.firstName) {
        name = `${this.user.firstName} ${this.user.lastName}`
      }
    } else if (this.user && this.user.personalDetails) {
      if (this.user.personalDetails.middlename) {
        // tslint:disable-next-line: max-line-length
        name = `${this.user.personalDetails.firstname} ${this.user.personalDetails.middlename} ${this.user.personalDetails.surname}`
      } else {
        name = `${this.user.personalDetails.firstname} ${this.user.personalDetails.surname}`
      }
    }
    return name
  }
  get usr() {
    return this.howerUser
  }

}
