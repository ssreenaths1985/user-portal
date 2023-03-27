import { Component, OnInit, Input } from '@angular/core'
import { WidgetBaseComponent, NsWidgetResolver } from '@sunbird-cb/resolver'

@Component({
  selector: 'ws-widget-home-network-component',
  templateUrl: './card-home-network.component.html',
  styleUrls: ['./card-home-network.component.scss'],
})
export class CardHomeNetworkComponent extends WidgetBaseComponent implements OnInit, NsWidgetResolver.IWidgetData<any> {
  @Input() widgetData: any
  newUserArray = ['1', '2', '3', '4']
  enablePeopleSearch = true
  imageSize = 'm'
  ngOnInit(): void {
  }
  getUserFullName(user: any) {
    if (user) {

    }
    return 'SH'
  }
  getUserSize() {
    return 'm'
  }
}
