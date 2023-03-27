import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'ws-app-global-search',
  templateUrl: './global-search.component.html',
  styleUrls: ['./global-search.component.scss'],
})
export class GlobalSearchComponent implements OnInit {
  searchParam: any
  searchparamFilters: any
  filtersPanel!: string | null
  selectedTab = 1
  tabs = ['All', 'Learn', 'Network', 'Discuss', 'Careers']

  constructor(private activated: ActivatedRoute) {

  }

  ngOnInit() {
    this.activated.queryParamMap.subscribe(queryParams => {
      if (queryParams.has('tab')) {
        const tabn = queryParams.get('tab')
        this.tabs.forEach((t: any, index: number) => {
          if (t === tabn) {
            this.selectedTab = index
          }
        })
      }
      if (queryParams.has('q')) {
        this.searchParam = queryParams.get('q') || ''
      }
      if (queryParams.has('f')) {
        const sfilters = JSON.parse(queryParams.get('f') || '{}')
        const paramfilter = [{
          mainType: 'primaryCategory',
          name: sfilters.contentType[0].toLowerCase(),
          count: '',
          ischecked: true,
        }, {
          mainType: 'competencies_v3.name',
          name: 'competencies_v3.name',
          count: '',
          values: sfilters['competencies_v3.name'],
          ischecked: true,
        },
        {
          mainType: 'topics',
          name: 'topics',
          count: '',
          values: sfilters['topics'],
          ischecked: true,
        }]
        this.searchparamFilters = paramfilter
      }

      if (queryParams.has('filtersPanel')) {
        this.filtersPanel = queryParams.get('filtersPanel')
      }
    })
  }

}
