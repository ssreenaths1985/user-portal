import { Component, OnInit } from '@angular/core'
import { NSNetworkDataV2 } from '../../models/network-v2.model'
import { FormControl } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'
import { NetworkV2Service } from '../../services/network-v2.service'
import { ConfigurationsService, WsEvents, EventService } from '@sunbird-cb/utils'

@Component({
  selector: 'ws-app-network-my-mdo',
  templateUrl: './network-my-mdo.component.html',
  styleUrls: ['./network-my-mdo.component.scss'],
  /* tslint:disable */
  host: { class: 'flex flex-1 mt-6 ' },
  /* tslint:enable */
})
export class NetworkMyMdoComponent implements OnInit {

  data!: NSNetworkDataV2.INetworkUser[]
  queryControl = new FormControl('')
  currentFilter = 'timestamp'
  currentFilterSort = 'desc'
  enableSearchFeature = false
  currentUserDept: any
  constructor(
    private route: ActivatedRoute,
    private networkV2Service: NetworkV2Service,
    private configSvc: ConfigurationsService,
    private eventSvc: EventService
  ) {
    // console.log('this.route.snapshot.data.myMdoList.data :', this.route.snapshot.data.myMdoList.data)
    this.currentUserDept = this.configSvc.userProfile && this.configSvc.userProfile.rootOrgName
    this.data = this.route.snapshot.data.myMdoList.data.result.data.
      find((item: any) => item.field === 'employmentDetails.departmentName').results

    this.data = this.data.map((v: NSNetworkDataV2.INetworkUser) => {
        if (v && v.personalDetails && v.personalDetails.firstname) {
          v.personalDetails.firstname = v.personalDetails.firstname.toLowerCase()
        }
        return v
      })
    // console.log('this.data : ', this.data)
  }

  ngOnInit() {
    this.queryControl.valueChanges.subscribe(val => {
      if (val.length === 0) {
        this.enableSearchFeature = false
      } else {
        this.enableSearchFeature = true
      }
    })
  }

  updateQuery(key: string) {
    if (key) {

    }
  }

  filter(key: string, order: string | 'asc' | 'desc') {
    if (key) {
      this.currentFilter = key
      this.currentFilterSort = order
    }
  }

  connectionUpdate(event: any) {
    if (event === 'connection-updated') {
      // let usrDept = 'iGOT'

      // if (this.configSvc.userProfile) {
      //   usrDept = this.configSvc.userProfile.departmentName || 'iGOT'
      // }
      let req: NSNetworkDataV2.IRecommendedUserReq
      req = {
        size: 50,
        offset: 0,
        search: [
          {
            field: 'employmentDetails.departmentName',
            values: [this.currentUserDept],
          },
        ],
      }
      this.networkV2Service.fetchAllRecommendedUsers(req).subscribe(
        (data: any) => {
          this.data = data.result.data.
            find((item: any) => item.field === 'employmentDetails.departmentName').results
        },
        (_err: any) => {
          // this.openSnackbar(err.error.message.split('|')[1] || this.defaultError)
        })
    }
  }

  public tabTelemetry(label: string, index: number) {
    const data: WsEvents.ITelemetryTabData = {
      label,
      index,
    }
    this.eventSvc.handleTabTelemetry(
      WsEvents.EnumInteractSubTypes.NETWORK_TAB,
      data,
    )
  }

}
