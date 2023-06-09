import { Component, OnInit } from '@angular/core'
import { FormGroup, FormControl } from '@angular/forms'
import { BrowseProviderService } from '../../services/browse-provider.service'
import { debounceTime, switchMap, takeUntil } from 'rxjs/operators'
import { Subject, Observable } from 'rxjs'
// tslint:disable
import _ from 'lodash'
import { LocalDataService } from '../../../browse-by-competency/services/localService';
// tslint:enable

@Component({
  selector: 'ws-app-all-providers',
  templateUrl: './all-providers.component.html',
  styleUrls: ['./all-providers.component.scss'],
})
export class AllProvidersComponent implements OnInit {
  public displayLoader!: Observable<boolean>
  provider = 'JPAL'
  page = 1
  defaultLimit = 20
  limit = 20
  searchForm: FormGroup | undefined
  sortBy: any
  searchQuery = ''
  allProviders: any
  disableLoadMore = false
  totalCount = 0
  private unsubscribe = new Subject<void>()
  titles = [
    { title: 'Learn', url: '/page/learn', icon: 'school' },
    { title: 'All Providers', url: 'none', icon: '' },
  ]
  getAllProvidersReq = {
    request: {
      filters: {
        isCbp: true,
      },
      sort_by: {
        orgName: 'asc',
      },
      query: '',
      limit: this.limit,
      offset: 0,
    },
  }
  constructor(
    private browseProviderSvc: BrowseProviderService,
    private localService: LocalDataService,
  ) { }

  ngOnInit() {
    this.searchForm = new FormGroup({
      sortByControl: new FormControl(''),
      searchKey: new FormControl(''),
    })
    this.displayLoader = this.browseProviderSvc.isLoading()
    this.searchForm.valueChanges
      .pipe(
        debounceTime(500),
        switchMap(async formValue => {
          this.sortBy = formValue.sortByControl
          this.updateQuery(formValue.searchKey)
        }),
        takeUntil(this.unsubscribe)
      ).subscribe()
    this.getAllProviders()
  }

  getAllProviders(req?: any) {
    this.allProviders = []
    const request = req || this.getAllProvidersReq
    let data = this.localService.providers.getValue()
    if (data && data.length === 0) {
      this.browseProviderSvc.fetchAllProviders(request).subscribe(response => {
        this.localService.initProviders(response)
        // if (res && res.result &&  res.result.response && res.result.response.content) {
        //   this.allProviders = res.result.response.content
        //   this.totalCount = res.result.response.count
        //   if ((this.page * this.defaultLimit) >= this.totalCount) {
        //     this.disableLoadMore = true
        //   } else {
        //     this.disableLoadMore = false
        //   }
        // }
        if (response) {
          const res = _.toArray(_.pickBy(response, v => v !== null && v !== undefined && !!v.name))
          const fData: any[] = []
          if (this.searchQuery) {
            _.each(res, (d: any) => {
              let found = false
              found = _.includes(_.lowerCase(this.searchQuery), _.lowerCase(_.get(d, 'name')))
                || _.includes(_.lowerCase(_.get(d, 'name')), _.lowerCase(this.searchQuery))
              if (found) {
                fData.push(d)
              }
            })
            this.allProviders = fData
          }
          if (this.sortBy) {
            this.allProviders = _.orderBy(fData.length ? fData : res, ['name'], [this.sortBy])
          } else {
            this.allProviders = fData.length ? fData : res
          }
          if (!this.searchQuery && !this.sortBy) {
            this.allProviders = fData.length ? fData : res
          }
          this.totalCount = fData.length || res.length
          if ((this.page * this.defaultLimit) >= this.totalCount) {
            this.disableLoadMore = true
          } else {
            this.disableLoadMore = false
          }
        }
      })
    } else {
      const fData: any[] = []
      data = _.toArray(_.pickBy(data, v => v !== null && v !== undefined && !!v.name))
      if (this.searchQuery) {
        _.each(data, (d: any) => {
          let found = false
          found = _.includes(_.lowerCase(this.searchQuery), _.lowerCase(_.get(d, 'name')))
            || _.includes(_.lowerCase(_.get(d, 'name')), _.lowerCase(this.searchQuery))
          if (found) {
            fData.push(d)
          }
        })
        this.allProviders = fData
      }
      if (this.sortBy) {
        this.allProviders = _.orderBy((fData.length ? fData : data), ['name'], [this.sortBy])
      }
      if (!this.searchQuery && !this.sortBy) {
        this.allProviders = fData.length ? fData : data
      }
      this.totalCount = data.length
      if ((this.page * this.defaultLimit) >= this.totalCount) {
        this.disableLoadMore = true
      } else {
        this.disableLoadMore = false
      }
    }
  }

  updateQuery(key: string) {
    this.searchQuery = key
    this.getAllProvidersReq.request.query = this.searchQuery
    this.getAllProvidersReq.request.offset = 0
    this.getAllProvidersReq.request.limit = this.defaultLimit
    this.page = 1
    this.getAllProvidersReq.request.sort_by.orgName = this.sortBy
    this.getAllProviders()
  }

  loadMore() {
    this.page = this.page + 1
    // this.getAllProvidersReq.request.offset = this.page * this.limit
    this.limit = (this.page * this.defaultLimit) || this.defaultLimit
    this.getAllProvidersReq.request.limit = this.limit
    this.getAllProviders()
    if ((this.page * this.defaultLimit) >= this.totalCount) {
      this.disableLoadMore = true
    } else {
      this.disableLoadMore = false
    }
  }

}
