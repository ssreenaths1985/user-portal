import { Component, OnInit, Input, OnChanges } from '@angular/core'
// import { ContentProgressService } from '@sunbird-cb/collection'
@Component({
  selector: 'ws-analytics-progress-radial',
  templateUrl: './progress-radial.component.html',
  styleUrls: ['./progress-radial.component.scss'],
})
export class ProgressRadialComponent implements OnInit, OnChanges {
  @Input() contentId = ''
  @Input() mode?: 'determinate' | 'indeterminate' = 'determinate'
  @Input() progress?: undefined | number = undefined

  constructor(
    // private contentProgressSvc: ContentProgressService
    ) { }

  ngOnInit() { }

  ngOnChanges() {
    if (this.progress === undefined) {
      // this.contentProgressSvc.getProgressFor(this.contentId).subscribe(data => {
      //   this.progress = data
      //   if (this.progress === undefined) {
      //     this.progress = 0
      //   }
      // })
    }
  }
}
