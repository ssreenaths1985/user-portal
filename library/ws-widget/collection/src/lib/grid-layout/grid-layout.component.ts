import { Component, OnInit, Input } from '@angular/core'
import { NsWidgetResolver, WidgetBaseComponent } from '@sunbird-cb/resolver'
import {
  IGridLayoutData,
  IGridLayoutProcessedData,
  responsiveSuffix,
  sizeSuffix,
  IGridLayoutDataMain,
} from './grid-layout.model'
@Component({
  selector: 'ws-widget-grid-layout',
  templateUrl: './grid-layout.component.html',
  styleUrls: ['./grid-layout.component.scss'],
})
export class GridLayoutComponent extends WidgetBaseComponent
  implements OnInit, NsWidgetResolver.IWidgetData<IGridLayoutDataMain> {
  @Input() widgetData!: IGridLayoutDataMain
  containerClass = ''
  processed: IGridLayoutProcessedData[][] = []

  ngOnInit() {
    if (this.widgetData.gutter != null) {
      this.containerClass = `-mx-${this.widgetData.gutter}`
    }
    const gutterAdjustment = this.widgetData.gutter !== null ? `p-${this.widgetData.gutter}` : ''
    this.processed = this.widgetData.widgets.map(row =>
      row.map(
        (col: IGridLayoutData): IGridLayoutProcessedData => ({
          className: Object.entries(col.dimensions).reduce(
            (agg, [k, v]) =>
              `${agg} ${(responsiveSuffix as { [id: string]: string })[k]}:${sizeSuffix[v]}`,
            `${col.className} w-full ${gutterAdjustment}`,
          ),
          styles: col.styles,
          widget: col.widget,
        }),
      ),
    )
  }
  tracker(index: number, item: any) {
    if (index >= 0) { }
    return item
  }
  tracker2(index: number, item: any) {
    if (index >= 0) { }
    return item
  }
}
