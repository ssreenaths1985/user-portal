import { Component, OnInit, OnDestroy, Input } from '@angular/core'
import { NSNetworkDataV2 } from '../../models/network-v2.model'
import { EventService, WsEvents } from '@sunbird-cb/utils/src/public-api'
/* tslint:disable*/
import _ from 'lodash'

@Component({
  selector: 'ws-app-left-menu',
  templateUrl: './left-menu.component.html',
  styleUrls: ['./left-menu.component.scss'],
})
export class LeftMenuComponent implements OnInit, OnDestroy {

  @Input()
  tabsData!: NSNetworkDataV2.IProfileTab
  constructor(
    private events: EventService,
  ) { }

  ngOnInit(): void {

  }
  ngOnDestroy() {

  }

  public menuClick(tab: any) {
    this.events.raiseInteractTelemetry(
      {
        type: WsEvents.EnumInteractTypes.CLICK,
        subType: WsEvents.EnumInteractSubTypes.SIDE_MENU,
        id: `${_.camelCase(tab.name)}-menu`,
      },
      { },
    )
  }

}
