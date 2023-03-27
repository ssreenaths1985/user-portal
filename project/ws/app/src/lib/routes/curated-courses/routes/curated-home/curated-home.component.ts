import { Component, OnInit } from '@angular/core'
import { FormGroup, FormControl } from '@angular/forms'
import { Observable, Subject } from 'rxjs'
import { CuratedCollectionService } from '../../services/curated-collection.service'
import { debounceTime, switchMap, takeUntil } from 'rxjs/operators'
import { ActivatedRoute } from '@angular/router'
/* tslint:disable*/
import _ from 'lodash'

@Component({
  selector: 'ws-app-curated-home',
  templateUrl: './curated-home.component.html',
  styleUrls: ['./curated-home.component.scss'],
})
export class CuratedHomeComponent implements OnInit {
  public displayLoader!: Observable<boolean>
  page = 1
  defaultLimit = 50
  limit = 50
  searchForm: FormGroup | undefined
  sortBy: any
  searchQuery = ''
  allCollections: any
  disableLoadMore = false
  totalCount = 0
  private unsubscribe = new Subject<void>()
  titles = [
    { title: 'Learn', url: '/page/learn', icon: 'school' },
    { title: 'Curated collections', url: 'none', icon: '' },
  ]
  searchReq: any
  searchReqDefault = {
    request: {
      filters: {
        primaryCategory: [
          'CuratedCollections',
          'Program',
        ],
      },
      query: '',
      sort_by: {
        name: 'asc',
      },
      limit: this.limit,
      offset: 0,
      fields: [],
      facets: ['primaryCategory', 'mimeType'],
      fuzzy: false,
    },
  }

  constructor(
    private curatedCollectionSvc: CuratedCollectionService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.searchReq = _.get(this.route, 'snapshot.data.pageData.data.search.searchReq') || this.searchReqDefault
    this.searchForm = new FormGroup({
      // sortByControl: new FormControl(''),
      searchKey: new FormControl(''),
    })
    this.displayLoader = this.curatedCollectionSvc.isLoading()
    this.searchForm.valueChanges
      .pipe(
        debounceTime(500),
        switchMap(async _formValue => {
          // this.sortBy = formValue.sortByControl
          // this.updateQuery(formValue.searchKey)
        }),
        takeUntil(this.unsubscribe)
      ).subscribe()
    this.getAllCuratedCollection()
  }

  getAllCuratedCollection(req?: any) {
    const request = req || this.searchReq
    this.curatedCollectionSvc.fetchSearchData(request).subscribe((res: any) => {
      if (res && res.result && res.result.count === 0) {
        this.disableLoadMore = true
        this.allCollections = []
        this.totalCount = res.result.count
      }
      if (res && res.result &&  res.result && res.result.content) {
        this.allCollections = res.result.content
        this.totalCount = res.result.count
        if ((this.page * this.defaultLimit) >= this.totalCount) {
          this.disableLoadMore = true
        } else {
          this.disableLoadMore = false
        }
      }
    })
  }

}
