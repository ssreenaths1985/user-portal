import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core'
import { FormGroup, FormControl } from '@angular/forms'
import { Subscription } from 'rxjs'
import { GbSearchService } from '../../services/gb-search.service'
import { ActivatedRoute } from '@angular/router'
// tslint:disable-next-line
import _ from 'lodash'

@Component({
  selector: 'ws-app-search-filters',
  templateUrl: './search-filters.component.html',
  styleUrls: ['./search-filters.component.scss'],
})
export class SearchFiltersComponent implements OnInit, OnDestroy {
  @Input() newfacets!: any
  @Input() urlparamFilters!: any
  @Output() appliedFilter = new EventEmitter<any>()
  filterForm: FormGroup | undefined
  filteroptions: any = []
  userFilters: any = []
  myFilterArray: any = []
  private subscription: Subscription = new Subscription

  constructor(private searchSrvc: GbSearchService, private activated: ActivatedRoute) { }

  ngOnInit() {
    this.newfacets.forEach((nf: any) => {
      if (nf.name === 'mimeType') {
        const values: any = []
        nf.values.forEach((nfv: any) => {
          const nv = {
            count: '',
            name: '',
          }
          if (nfv.name !== 'video/mp4' && nfv.name !== 'video/x-youtube' && nfv.name !== 'application/json' &&
            nfv.name !== 'application/x-mpegURL' && nfv.name !== 'application/quiz' && nfv.name !== 'image/jpeg' &&
            nfv.name !== 'image/png' && nfv.name !== 'application/vnd.ekstep.html-archive' &&
            nfv.name !== 'application/vnd.ekstep.ecml-archive') {
            values.push(nfv)
          } else {
            if (nfv.name === 'video/mp4' || nfv.name === 'video/x-youtube' || nfv.name === 'application/x-mpegURL') {
              nv.name = 'Video'
              const indx = values.filter((x: any) => x.name === nv.name)
              if (indx.length === 0) {
                values.push(nv)
              }
            }
            if (nfv.name === 'application/json' || nfv.name === 'application/quiz') {
              nv.name = 'Assessment'
              const indx = values.filter((x: any) => x.name === nv.name)
              if (indx.length === 0) {
                values.push(nv)
              }
            }
            if (nfv.name === 'image/jpeg' || nfv.name === 'image/png') {
              nv.name = 'Image'
              const indx = values.filter((x: any) => x.name === nv.name)
              if (indx.length === 0) {
                values.push(nv)
              }
            }
            if (nfv.name === 'application/vnd.ekstep.html-archive' || nfv.name === 'application/vnd.ekstep.ecml-archive') {
              nv.name = 'Interactive Content'
              const indx = values.filter((x: any) => x.name === nv.name)
              if (indx.length === 0) {
                values.push(nv)
              }
            }
          }
        })
        nf.values = values
      }
      if (nf.name === 'source') {
        nf.values.sort((a: any, b: any) => {
          const textA = a.name.toUpperCase()
          const textB = b.name.toUpperCase()
          return (textA < textB) ? -1 : (textA > textB) ? 1 : 0
        })
      }
    })
    this.filteroptions = this.newfacets
    this.activated.queryParamMap.subscribe(queryParams => {
      if (queryParams.has('f')) {
        const sfilters = JSON.parse(queryParams.get('f') || '{}')
        const fil = {
          name: sfilters.primaryCategory[0].toLowerCase(),
          count: '',
          ischecked: true,
        }
        this.filteroptions.forEach((fas: any) => {
          fas.values.forEach((fasv: any) => {
            if (fas.name === 'primaryCategory') {
              if (fasv.name === fil.name) {
                fasv.ischecked = true
              }
            } else {
              fasv.ischecked = false
            }
          })
        })
        this.modifyUserFilters(fil, 'primaryCategory')
      } else {
        const fil = {
          name: 'course',
          count: '',
          ischecked: true,
        }
        this.filteroptions.forEach((fas: any) => {
          fas.values.forEach((fasv: any) => {
            if (fas.name === 'primaryCategory') {
              if (fasv.name === fil.name) {
                fasv.ischecked = true
              }
            } else {
              fasv.ischecked = false
            }
          })
        })
        const reqfilter = {
          mainType: 'primaryCategory',
          name: fil.name,
          count: fil.count,
          ischecked: true,
        }
        this.myFilterArray.push(reqfilter)
        if (this.userFilters.length === 0) {
          this.userFilters.push(fil)
        }
      }
    })
    // if (this.urlparamFilters) {
    //   this.filteroptions.forEach((fas: any) => {
    //     fas.values.forEach((fasv: any) => {
    //       if (this.urlparamFilters && fas.name === this.urlparamFilters.mainType) {
    //           if (fasv.name === this.urlparamFilters.name) {
    //             fasv.ischecked = true
    //           }
    //       } else {
    //         fasv.ischecked = false
    //       }
    //     })
    //   })
    // }

    this.filterForm = new FormGroup({
      filters: new FormControl(''),
    })
    this.subscription = this.searchSrvc.notifyObservable$.subscribe((res: any) => {
      const fil = {
        name: res.name,
        count: res.count,
        ischecked: false,
      }
      if (this.userFilters.length === 0) {
        this.userFilters.push(fil)
      }
      this.modifyUserFilters(fil, res.mainType)
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

  getFilterName(fil: any) {
    return this.userFilters.filter((x: any) => x.name === fil.name)
  }

  modifyUserFilters(fil: any, mainparentType: any) {
    const indx = this.getFilterName(fil)
    if (indx.length > 0) {
      this.userFilters.forEach((fs: any, index: number) => {
        if (fs.name === fil.name) {
          this.userFilters.splice(index, 1)
        }
      })
      this.myFilterArray.forEach((fs: any, index: number) => {
        if (fs.name === fil.name) {
          this.myFilterArray.splice(index, 1)
        }
      })
      this.filteroptions.forEach((fas: any) => {
        if (fas.name === mainparentType) {
          fas.values.forEach((fasv: any) => {
            if (fasv.name === fil.name) {
              fasv.ischecked = false
            }
          })
        }
      })
      this.appliedFilter.emit(this.myFilterArray)
    } else {
      this.userFilters.push(fil)

      const reqfilter = {
        mainType: mainparentType,
        name: fil.name,
        count: fil.count,
        ischecked: true,
      }
      this.filteroptions.forEach((fas: any) => {
        if (fas.name === mainparentType) {
          fas.values.forEach((fasv: any) => {
            if (fasv.name === fil.name) {
              fasv.ischecked = true
            }
          })
        }
      })
      this.myFilterArray.push(reqfilter)
      this.appliedFilter.emit(this.myFilterArray)
    }
  }
  getText(val: string) {
    return _.startCase(val || '')
  }
}
