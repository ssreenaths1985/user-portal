import { Component, OnInit, OnChanges, SimpleChanges, OnDestroy } from '@angular/core'
import { ConfigurationsService, EventService, WsEvents } from '@sunbird-cb/utils'
import { FormGroup, FormControl } from '@angular/forms'
import { BrowseCompetencyService } from '../../services/browse-competency.service'
import { NSBrowseCompetency } from '../../models/competencies.model'
import { debounceTime, switchMap, takeUntil } from 'rxjs/operators'
import { Subject, Observable } from 'rxjs'
// tslint:disable
import _ from 'lodash'
// tslint:enable
import { LocalDataService } from '../../services/localService'

@Component({
  selector: 'ws-app-all-competencies',
  templateUrl: './all-competencies.component.html',
  styleUrls: ['./all-competencies.component.scss'],
})
export class AllCompetenciesComponent implements OnInit, OnDestroy, OnChanges {
  private unsubscribe = new Subject<void>()
  public displayLoader!: Observable<boolean>
  defaultThumbnail = ''
  allCompetencies!: NSBrowseCompetency.ICompetencie[]
  competencyAreas: any
  searchForm: FormGroup | undefined
  appliedFilters: any = []
  searchQuery = ''
  sortBy: any
  stateData: {
    param: any, path: any
  } | undefined
  // searchCompArea = new FormControl('')
  titles = [
    { title: 'Learn', url: '/page/learn', icon: 'school' },
    { title: 'All Competencies', url: 'none', icon: '' },
  ]

  compentency = 'some-competency'

  constructor(
    private configSvc: ConfigurationsService,
    private events: EventService,
    private browseCompServ: BrowseCompetencyService,
    private localDataService: LocalDataService,
  ) { }

  ngOnInit() {
    this.displayLoader = this.browseCompServ.isLoading()
    this.stateData = { param: '', path: 'all-competencies' }
    this.searchForm = new FormGroup({
      sortByControl: new FormControl(''),
      searchKey: new FormControl(''),
    })
    const instanceConfig = this.configSvc.instanceConfig
    if (instanceConfig) {
      this.defaultThumbnail = instanceConfig.logos.defaultContent || ''
    }
    this.searchForm.valueChanges
      .pipe(
        debounceTime(500),
        switchMap(async formValue => {
          this.sortBy = formValue.sortByControl
          this.updateQuery(formValue.searchKey)
        }),
        takeUntil(this.unsubscribe)
      ).subscribe()

    // if(this.searchForm.get('sortByControl')) {
    //   this.searchForm.get('sortByControl')!.valueChanges.pipe(
    //     debounceTime(500),
    //     takeUntil(this.unsubscribe)
    //   ).subscribe(val => {
    //     this.sortBy = val
    //   });
    // }

    // Fetch initial data
    this.searchCompetency('')

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.param.currentValue) {
      // this.getSearchedData()
    }
  }

  searchCompetency(searchQuery: any, filters?: any) {
    this.allCompetencies = []
    const searchJson = [
      { type: 'COMPETENCY', field: 'name', keyword: searchQuery ? searchQuery : '' },
      { type: 'COMPETENCY', field: 'description', keyword: searchQuery ? searchQuery : '' },
      // { type: 'COMPETENCY', field: 'competencyType', keyword: 'Behavioural' },
      { type: 'COMPETENCY', field: 'status', keyword: 'VERIFIED' },
    ]
    const filterJson = []
    if (filters && filters.length) {
      const groups = _.groupBy(filters, 'mainType')
      for (const key of Object.keys(groups)) {
        const filter: { field: string, values: string[] } = { field: key, values: [''] }
        const keywords = groups[key].map(x => x.name)
        filter.values = keywords
        filterJson.push(filter)
      }
    }
    const req = {
      searches: searchJson,
      filter: filterJson,
      sort: this.sortBy,
    }
    if (!(this.localDataService.compentecies.value
      && this.localDataService.compentecies.getValue().length > 0)) {
      this.browseCompServ
        .searchCompetency(req)
        .subscribe((reponse: NSBrowseCompetency.ICompetencie[]) => {
          // if (reponse.statusInfo && reponse.statusInfo.statusCode === 200) {
          //   this.allCompetencies = reponse.responseData
          // }
          if (reponse) {
            // this.allCompetencies
            if (req && req.filter && req.filter.length > 0) {
              _.each(reponse, r => {
                _.each(req.filter, f => {
                  if (_.includes(f.values, _.get(r, f.field))) {
                    this.allCompetencies.push(r)
                  }
                })
              })
              // this.allCompetencies = _.orderBy(this.allCompetencies, ['name'], [req.sort === 'Descending'])
            } else {
              this.allCompetencies = reponse
            }
            this.localDataService.initData(reponse)
          }
        })
    } else {
      const data = this.localDataService.compentecies.getValue()
      if (data && req && req.filter && req.filter.length > 0) {
        _.each(data, r => {
          _.each(req.filter, f => {
            if (_.includes(f.values, _.get(r, f.field))) {
              this.allCompetencies.push(r)
            }
          })
        })
        if (req.sort) {
          this.allCompetencies = _.orderBy(this.allCompetencies, ['name'], [req.sort === 'Descending' ? 'desc' : 'asc'])
        }
      } else {
        const fData: NSBrowseCompetency.ICompetencie[] = []
        if (req.searches && req.searches.length > 0) {
          _.each(data, (d: NSBrowseCompetency.ICompetencie) => {
            let found = false
            _.each(_.initial(req.searches), s => {
              found = found || _.includes(_.lowerCase(_.get(d, s.field)), _.lowerCase(s.keyword))
            })
            if (found) {
              fData.push(d)
            }
          })
          this.allCompetencies = fData
        }
        if (req.sort) {
          this.allCompetencies = _.orderBy(fData || data, ['name'], [req.sort === 'Descending' ? 'desc' : 'asc'])
        } else {
          this.allCompetencies = fData || data
        }
      }
    }
  }

  updateQuery(key: string) {
    this.searchQuery = key
    this.searchCompetency(this.searchQuery, this.appliedFilters)
  }

  reset() {
    // this.searchForm.setValue('searchKey') = ''
    this.searchCompetency('')
  }

  raiseTelemetry(content: any) {
    if (content) {
      this.events.raiseInteractTelemetry(
        {
          type: 'click',
          subType: `card-${content.primaryCategory || 'content'}`,
          // id: content.identifier || '',
        },
        {
          id: content.identifier || '',
          type: content.primaryCategory,
          // contentId: content.identifier || '',
          // contentType: content.primaryCategory,
          rollup: {},
          ver: `${content.version}${''}`,
        },
        {
          pageIdExt: 'knowledge-card',
          module: WsEvents.EnumTelemetrymodules.COMPETENCY,
        })
    }
  }
  get allComp() {
    return this.allCompetencies
  }
  applyFilter(filter: any) {
    if (filter) {
      this.appliedFilters = filter

      this.searchCompetency(this.searchQuery, this.appliedFilters)
      // const queryparam = this.searchRequestObject
    }
    // console.log('Filter', filter)
  }

  removeFilter(filter: any) {
    // this.rfilter = filter
    this.browseCompServ.notifyOther(filter)
  }

  ngOnDestroy() {
    this.unsubscribe.next()
  }
}
