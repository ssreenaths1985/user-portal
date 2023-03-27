import { Component, OnInit, Input, OnDestroy, HostBinding } from '@angular/core'
import { NsWidgetResolver, WidgetBaseComponent } from '@sunbird-cb/resolver'
import { NsContentStripNewMultiple } from './content-strip-new-multiple.model'
import { ContentStripNewMultipleService } from './content-strip-new-multiple.service'
import { WidgetContentService } from '../_services/widget-content.service'
import { NsContent } from '../_services/widget-content.model'
import {
  TFetchStatus,
  LoggerService,
  EventService,
  ConfigurationsService,
  UtilityService,
} from '@sunbird-cb/utils'
import { Subscription } from 'rxjs'
import { filter } from 'rxjs/operators'
import { WidgetUserService } from '../_services/widget-user.service'
 // tslint:disable-next-line
import _ from 'lodash'
import { HttpClient } from '@angular/common/http'
// import { SearchServService } from '../_services/search-serv.service'

interface IStripUnitContentData {
  key: string
  canHideStrip: boolean
  mode?: string
  showStrip: boolean
  widgets?: NsWidgetResolver.IRenderConfigWithAnyData[]
  stripTitle: string
  stripName?: string
  stripLogo?: string
  description?: string
  stripInfo?: NsContentStripNewMultiple.IStripInfo
  noDataWidget?: NsWidgetResolver.IRenderConfigWithAnyData
  errorWidget?: NsWidgetResolver.IRenderConfigWithAnyData
  showOnNoData: boolean
  showOnLoader: boolean
  showOnError: boolean
  stripBackground?: string
  viewMoreUrl: {
    path: string
    queryParams: any
  } | null
}

@Component({
  selector: 'ws-widget-content-strip-new-multiple',
  templateUrl: './content-strip-new-multiple.component.html',
  styleUrls: ['./content-strip-new-multiple.component.scss'],
})
export class ContentStripNewMultipleComponent extends WidgetBaseComponent
  implements
  OnInit,
  OnDestroy,
  NsWidgetResolver.IWidgetData<NsContentStripNewMultiple.IContentStripMultiple> {
  @Input() widgetData!: NsContentStripNewMultiple.IContentStripMultiple
  @HostBinding('id')
  public id = `new-multiple_${Math.random()}`
  stripsResultDataMap: { [key: string]: IStripUnitContentData } = {}
  stripsKeyOrder: string[] = []
  showAccordionData = true
  showParentLoader = false
  showParentError = false
  showParentNoData = false
  errorDataCount = 0
  noDataCount = 0
  successDataCount = 0
  searchArray = ['preview', 'channel', 'author']
  contentAvailable = true
  isFromAuthoring = false
  baseUrl = this.configSvc.sitePath || ''

  changeEventSubscription: Subscription | null = null

  constructor(
    private contentStripSvc: ContentStripNewMultipleService,
    private contentSvc: WidgetContentService,
    private loggerSvc: LoggerService,
    private eventSvc: EventService,
    private configSvc: ConfigurationsService,
    public utilitySvc: UtilityService,
    private http: HttpClient,
    // private searchServSvc: SearchServService,
    private userSvc: WidgetUserService,
  ) {
    super()
  }

  ngOnInit() {
    const url = window.location.href
    this.isFromAuthoring = this.searchArray.some((word: string) => {
      return url.indexOf(word) > -1
    })
    this.initData()
  }

  ngOnDestroy() {
    if (this.changeEventSubscription) {
      this.changeEventSubscription.unsubscribe()
    }
  }
  getContineuLearningLenth(data: IStripUnitContentData) {
    return data.widgets ? data.widgets.length : 0
  }
  getLength(data: IStripUnitContentData) {
    return data.widgets ? data.widgets.length : 0
  }

  private initData() {
    this.stripsKeyOrder = this.widgetData.strips.map(strip => strip.key) || []
    if (this.widgetData.loader && this.widgetData.strips.length) {
      this.showParentLoader = true
    }
    // Fetch the data
    for (const strip of this.widgetData.strips) {
      if (this.checkForEmptyWidget(strip)) {
        this.fetchStripFromRequestData(strip)
      } else {
        this.processStrip(strip, [], 'done', true, null)
      }
    }
    // Subscription for changes
    const keyAndEvent: { key: string; type: string; from: string }[] = this.widgetData.strips
      .map(strip => ({
        key: strip.key,
        type: (strip.refreshEvent && strip.refreshEvent.eventType) || '',
        from: (strip.refreshEvent && strip.refreshEvent.from.toString()) || '',
      }))
      .filter(({ key, type, from }) => key && type && from)
    const eventTypeSet = new Set(keyAndEvent.map(e => e.type))
    this.changeEventSubscription = this.eventSvc.events$
      .pipe(filter(event => eventTypeSet.has(event.eventType)))
      .subscribe(event => {
        keyAndEvent
          .filter(e => e.type === event.eventType && e.from === event.from)
          .map(e => e.key)
          .forEach(k => this.fetchStripFromKey(k, false))
      })
  }

  private fetchStripFromKey(key: string, calculateParentStatus = true) {
    const stripData = this.widgetData.strips.find(strip => strip.key === key)
    if (stripData) {
      this.fetchStripFromRequestData(stripData, calculateParentStatus)
    }
  }

  private getFiltersFromArray(v6filters: any) {
    const filters: any = {}
    if (v6filters.constructor === Array) {
      v6filters.forEach(((f: any) => {
        Object.keys(f).forEach(key => {
          filters[key] = f[key]
        })
      }))
      return filters
    }
    return v6filters
  }

  private transformSearchV6FiltersV2(v6filters: any) {
    const filters: any = {}
    if (v6filters.constructor === Array) {
      v6filters.forEach(((f: any) => {
        Object.keys(f).forEach(key => {
          filters[key] = f[key]
        })
      }))
      return filters
    }
    return v6filters
  }

  private fetchStripFromRequestData(
    strip: NsContentStripNewMultiple.IContentStripUnit,
    calculateParentStatus = true,
  ) {
    // setting initial values
    this.processStrip(strip, [], 'fetching', false, null)
    // if (!(strip.request && strip.request.networkApi)) {
    this.fetchFromApi(strip, calculateParentStatus)
    this.fetchFromSearch(strip, calculateParentStatus)
    this.fetchFromSearchRegionRecommendation(strip, calculateParentStatus)
    this.fetchFromSearchV6(strip, calculateParentStatus)
    this.fetchFromIds(strip, calculateParentStatus)
    this.fetchFromEnrollmentList(strip, calculateParentStatus)
    this.fetchRecommendedCourses(strip, calculateParentStatus)
    // } else {
    //   this.fetchNetworkUsers(strip, calculateParentStatus)
    // }
  }
  // fetchNetworkUsers(strip: NsContentStripNewMultiple.IContentStripUnit, calculateParentStatus: boolean) {
  //   if (strip.request && strip.request.networkApi && Object.keys(strip.request.networkApi).length) {
  //     this.contentStripSvc.fetchNetworkUsers(strip.request.networkApi.data, strip.request.networkApi.path).subscribe(
  //       results => {
  //         this.processStrip(
  //           strip,
  //           this.transformContentsToWidgets(results.contents, strip),
  //           'done',
  //           calculateParentStatus,
  //           null,
  //         )
  //       }
  //     )
  //   }
  // }
  fetchFromApi(strip: NsContentStripNewMultiple.IContentStripUnit, calculateParentStatus = true) {
    if (strip.request && strip.request.api && Object.keys(strip.request.api).length) {
      this.contentStripSvc.getContentStripResponseApi(strip.request.api).subscribe(
        results => {
          this.processStrip(
            strip,
            this.transformContentsToWidgets(results.contents, strip),
            'done',
            calculateParentStatus,
            null,
          )
        },
        () => {
          this.processStrip(strip, [], 'error', calculateParentStatus, null)
        },
      )
    }
  }
  fetchFromSearch(strip: NsContentStripNewMultiple.IContentStripUnit, calculateParentStatus = true) {
    if (strip.request && strip.request.search && Object.keys(strip.request.search).length) {
      if (this.configSvc.activeLocale) {
        strip.request.search.locale = [this.configSvc.activeLocale.locals[0]]
      } else {
        strip.request.search.locale = ['en']
      }
      this.contentSvc.search(strip.request.search).subscribe(
        results => {
          const showViewMore = Boolean(
            results.result.length > 5 && strip.stripConfig && strip.stripConfig.postCardForSearch,
          )
          const viewMoreUrl = showViewMore
            ? {
              path: '/app/search/learning',
              queryParams: {
                q: strip.request && strip.request.search && strip.request.search.query,
                f: JSON.stringify(
                  strip.request && strip.request.search && strip.request.search.filters,
                ),
              },
            }
            : null
          this.processStrip(
            strip,
            this.transformContentsToWidgets(results.result, strip),
            'done',
            calculateParentStatus,
            viewMoreUrl,
          )
        },
        () => {
          this.processStrip(strip, [], 'error', calculateParentStatus, null)
        },
      )
    }
  }
  fetchFromSearchRegionRecommendation(
    strip: NsContentStripNewMultiple.IContentStripUnit,
    calculateParentStatus = true,
  ) {
    if (
      strip.request &&
      strip.request.searchRegionRecommendation &&
      Object.keys(strip.request.searchRegionRecommendation).length
    ) {
      this.contentSvc
        .searchRegionRecommendation(strip.request.searchRegionRecommendation)
        .subscribe(
          results => {
            this.processStrip(
              strip,
              this.transformContentsToWidgets(results.contents, strip),
              'done',
              calculateParentStatus,
              null,
            )
          },
          () => {
            this.processStrip(strip, [], 'error', calculateParentStatus, null)
          },
        )
    }
  }
  fetchFromSearchV6(strip: NsContentStripNewMultiple.IContentStripUnit, calculateParentStatus = true) {
    if (strip.request && strip.request.searchV6 && Object.keys(strip.request.searchV6).length) {
      if (!(strip.request.searchV6.locale && strip.request.searchV6.locale.length > 0)) {
        if (this.configSvc.activeLocale) {
          strip.request.searchV6.locale = [this.configSvc.activeLocale.locals[0]]
        } else {
          strip.request.searchV6.locale = ['en']
        }
      }
      this.contentSvc.searchV6(strip.request.searchV6).subscribe(
        results => {
          const showViewMore = Boolean(
            results.result.content.length > 5 && strip.stripConfig && strip.stripConfig.postCardForSearch,
          )
          const viewMoreUrl = showViewMore
            ? {
              path: '/app/search/learning',
              queryParams: {
                q: strip.request && strip.request.searchV6 && strip.request.searchV6.query,
                f:
                  strip.request && strip.request.searchV6 && strip.request.searchV6.filters
                    ? JSON.stringify(
                      // this.searchServSvc.transformSearchV6Filters(
                      strip.request.searchV6.filters
                      // ),
                    )
                    : {},
              },
            }
            : null
          this.processStrip(
            strip,
            this.transformContentsToWidgets(results.result.content, strip),
            'done',
            calculateParentStatus,
            viewMoreUrl,
          )
        },
        () => {
          this.processStrip(strip, [], 'error', calculateParentStatus, null)
        },
      )
    }
  }
  fetchFromIds(strip: NsContentStripNewMultiple.IContentStripUnit, calculateParentStatus = true) {
    if (strip.request && strip.request.ids && Object.keys(strip.request.ids).length) {
      this.contentSvc.fetchMultipleContent(strip.request.ids).subscribe(
        results => {
          this.processStrip(
            strip,
            this.transformContentsToWidgets(results, strip),
            'done',
            calculateParentStatus,
            null,
          )
        },
        () => {
          this.processStrip(strip, [], 'error', calculateParentStatus, null)
        },
      )
    }
  }
  fetchFromEnrollmentList(strip: NsContentStripNewMultiple.IContentStripUnit, calculateParentStatus = true) {
    if (strip.request && strip.request.enrollmentList && Object.keys(strip.request.enrollmentList).length) {
      let userId = ''
      let content: NsContent.IContent[]
      let contentNew: NsContent.IContent[]
      const queryParams = _.get(strip.request.enrollmentList, 'queryParams')
      if (this.configSvc.userProfile) {
        userId = this.configSvc.userProfile.userId
      }
      // tslint:disable-next-line: deprecation
      this.userSvc.fetchUserBatchList(userId, queryParams).subscribe(
        courses => {
          const showViewMore = Boolean(
            courses.length > 5 && strip.stripConfig && strip.stripConfig.postCardForSearch,
          )
          const viewMoreUrl = showViewMore
            ? {
              path: '/app/search/learning',
              queryParams: {
                q: strip.request && strip.request.searchV6 && strip.request.searchV6.query,
                f:
                  strip.request && strip.request.searchV6 && strip.request.searchV6.filters
                    ? JSON.stringify(
                      // this.searchServSvc.transformSearchV6Filters(
                      strip.request.searchV6.filters
                      // ),
                    )
                    : {},
              },
            }
            : null
          if (courses && courses.length) {
            content = courses.map(c => {
              const contentTemp: NsContent.IContent = c.content
              contentTemp.completionPercentage = c.completionPercentage || c.progress || 0
              contentTemp.completionStatus = c.completionStatus || c.status || 0
              contentTemp.enrolledDate = c.enrolledDate || ''
              return contentTemp
            })
          }
          // To filter content with completionPercentage > 0,
          // so that only those content will show in home page
          // continue learing strip
          // if (content && content.length) {
          //   contentNew = content.filter((c: any) => {
          //     /** commented as both are 0 after enrolll */
          //     if (c.completionPercentage && c.completionPercentage > 0) {
          //       return c
          //     }
          //   })
          // }

          // To sort in descending order of the enrolled date
          contentNew = (content || []).sort((a: any, b: any) => {
            const dateA: any = new Date(a.enrolledDate || 0)
            const dateB: any = new Date(b.enrolledDate || 0)
            return dateB - dateA
          })
          this.processStrip(
            strip,
            this.transformContentsToWidgets(contentNew, strip),
            'done',
            calculateParentStatus,
            viewMoreUrl,
          )
        },
        () => {
          this.processStrip(strip, [], 'error', calculateParentStatus, null)
        }
      )
    }
  }

  fetchRecommendedCourses(strip: NsContentStripNewMultiple.IContentStripUnit, calculateParentStatus = true) {
    if (strip.request && strip.request.recommendedCourses && Object.keys(strip.request.recommendedCourses).length) {
      if (this.configSvc.userProfileV2 &&
        this.configSvc.userProfileV2.competencies &&
        this.configSvc.userProfileV2.competencies.length) {
        // this.http.get(`${this.baseUrl}/common/master-competencies.json`).pipe(
        //   map(data => {
        //     console.log('data ::: ', data)
        //     // _.differenceWith(data, this.configSvc.userProfileV2.competencies, 'name')
        //   },
        //   (err => of({ data: null, error: err }),
        // )
        const userCompetenies = this.configSvc.userProfileV2.competencies

        this.http
        .get(`${strip.request.masterCompetency.request.url}/${strip.request.masterCompetency.request.filename}`)
        .subscribe((masterCompetencies: any) => {
            // const competencyDiff = _.differenceWith(masterCompetencies, userCompetenies, _.isEqual)
            const competencyDiff = masterCompetencies.filter((a: any) => !userCompetenies.some((b: any) => a.name === b.name))
            const competencyDiffNames = _.map(competencyDiff, 'name')
            const originalFilters: any = strip.request &&
            strip.request.recommendedCourses &&
            strip.request.recommendedCourses.request.filters
            originalFilters['competencies_v3.name'] = competencyDiffNames
            if (strip.request) {
              strip.request.recommendedCourses.request.filters = this.getFiltersFromArray(
                originalFilters,
              )
            }
            this.contentSvc.searchV6(strip.request && strip.request.recommendedCourses).subscribe(
              results => {
                const showViewMore = Boolean(
                  results.result && results.result.content && results.result.content.length > 5 &&
                  strip.stripConfig && strip.stripConfig.postCardForSearch,
                )
                const viewMoreUrl: any = showViewMore
                  ? {
                    tab: 'Learn',
                    path: strip.viewMoreUrl && strip.viewMoreUrl.path,
                    viewMoreText: (strip.viewMoreUrl && strip.viewMoreUrl.viewMoreText) || '',
                    queryParams: {
                      filtersPanel: 'hide',
                      q: `${strip.request && strip.request.recommendedCourses && strip.request.recommendedCourses.query}` ,
                      f:
                      strip.request &&
                        strip.request.recommendedCourses &&
                        strip.request.recommendedCourses.request &&
                        strip.request.recommendedCourses.request.filters
                        ? JSON.stringify(
                          this.transformSearchV6FiltersV2(
                            originalFilters,
                          )
                        )
                        : {},
                    },
                  }
                  : null

                strip.viewMoreUrl = viewMoreUrl
                this.processStrip(
                  strip,
                  this.transformContentsToWidgets(results.result.content, strip),
                  'done',
                  calculateParentStatus,
                  viewMoreUrl,
                )
              },
              () => {
                this.processStrip(strip, [], 'error', calculateParentStatus, null)
              },
            )
          },       () => {
              this.processStrip(strip, [], 'error', calculateParentStatus, null)
        })
      }
    }
  }

  private transformContentsToWidgets(
    contents: NsContent.IContent[],
    strip: NsContentStripNewMultiple.IContentStripUnit,
  ) {
    return (contents || []).map((content, idx) => ({
      widgetType: 'card',
      widgetSubType: 'cardContent',
      widgetHostClass: 'mb-2',
      widgetData: {
        content,
        cardSubType: strip.stripConfig && strip.stripConfig.cardSubType,
        context: { pageSection: strip.key, position: idx },
        intranetMode: strip.stripConfig && strip.stripConfig.intranetMode,
        deletedMode: strip.stripConfig && strip.stripConfig.deletedMode,
        contentTags: strip.stripConfig && strip.stripConfig.contentTags,
      },
    }))
  }

  showAccordion(key: string) {
    if (this.utilitySvc.isMobile && this.stripsResultDataMap[key].mode === 'accordion') {
      return this.showAccordionData
    }
    return true
  }

  setHiddenForStrip(key: string) {
    this.stripsResultDataMap[key].showStrip = false
    sessionStorage.setItem(`cstrip_${key}`, '1')
  }
  private getIfStripHidden(key: string): boolean {
    const storageItem = sessionStorage.getItem(`cstrip_${key}`)
    return Boolean(storageItem !== '1')
  }

  private async processStrip(
    strip: NsContentStripNewMultiple.IContentStripUnit,
    results: NsWidgetResolver.IRenderConfigWithAnyData[] = [],
    fetchStatus: TFetchStatus,
    calculateParentStatus = true,
    viewMoreUrl: any,
    // calculateParentStatus is used so that parents' status is not re-calculated if the API is called again coz of filters, etc.
  ) {
    // this.stripsResultDataMap[strip.key]
    if (results.length && strip.fetchLikes) {
      await this.processContentLikes(results)
    }
    const stripData = {
      viewMoreUrl,
      key: strip.key,
      canHideStrip: Boolean(strip.canHideStrip),
      showStrip: this.getIfStripHidden(strip.key),
      noDataWidget: strip.noDataWidget,
      errorWidget: strip.errorWidget,
      stripInfo: strip.info,
      stripTitle: strip.title,
      description: strip.titleDescription,
      stripLogo: strip.logo,

      stripName: strip.name,
      mode: strip.mode,
      stripBackground: strip.stripBackground,
      widgets:
        fetchStatus === 'done'
          ? [
            ...(strip.preWidgets || []).map(w => ({
              ...w,
              widgetHostClass: `mb-2 ${w.widgetHostClass}`,
            })),
            ...results,
            ...(strip.postWidgets || []).map(w => ({
              ...w,
              widgetHostClass: `mb-2 ${w.widgetHostClass}`,
            })),
          ]
          : [],
      showOnNoData: Boolean(
        strip.noDataWidget &&
        !((strip.preWidgets || []).length + results.length + (strip.postWidgets || []).length) &&
        fetchStatus === 'done',
      ),
      showOnLoader: Boolean(strip.loader && fetchStatus === 'fetching'),
      showOnError: Boolean(strip.errorWidget && fetchStatus === 'error'),
    }
    // const stripData = this.stripsResultDataMap[strip.key]
    this.stripsResultDataMap = {
      ...this.stripsResultDataMap,
      [strip.key]: stripData,
    }
    if (
      calculateParentStatus &&
      (fetchStatus === 'done' || fetchStatus === 'error') &&
      stripData.widgets
    ) {
      this.checkParentStatus(fetchStatus, stripData.widgets.length)
    }
    if (calculateParentStatus && !(results && results.length > 0)) {
      this.contentAvailable = false
    } else if (results && results.length > 0) {
      this.contentAvailable = true
    }
  }
  private checkParentStatus(fetchStatus: TFetchStatus, stripWidgetsCount: number): void {
    if (fetchStatus === 'done' && !stripWidgetsCount) {
      this.noDataCount += 1
    } else if (fetchStatus === 'done' && stripWidgetsCount) {
      this.successDataCount += 1
    } else if (fetchStatus === 'error') {
      this.errorDataCount += 1
    }
    const settledCount = this.noDataCount + this.successDataCount + this.errorDataCount
    const totalCount = this.widgetData.strips.length
    if (this.successDataCount > 0 && settledCount < totalCount) {
      return
    }
    this.showParentLoader = settledCount !== totalCount
    this.showParentNoData =
      this.noDataCount > 0 && this.noDataCount + this.errorDataCount === totalCount
    this.showParentError = this.errorDataCount === totalCount
  }

  toggleInfo(data: IStripUnitContentData) {
    const stripInfo = this.stripsResultDataMap[data.key].stripInfo
    if (stripInfo) {
      if (stripInfo.mode !== 'below') {
        this.loggerSvc.warn(`strip info mode: ${stripInfo.mode} not implemented yet`)
        stripInfo.mode = 'below'
      }
      if (stripInfo.mode === 'below') {
        this.stripsResultDataMap[data.key].stripInfo = {
          ...stripInfo,
          visibilityMode: stripInfo.visibilityMode === 'hidden' ? 'visible' : 'hidden',
        }
      }
    }
  }

  checkForEmptyWidget(strip: NsContentStripNewMultiple.IContentStripUnit): boolean {
    if (
      strip.request &&
      ((strip.request.api && Object.keys(strip.request.api).length) ||
        (strip.request.search && Object.keys(strip.request.search).length) ||
        (strip.request.searchRegionRecommendation &&
          Object.keys(strip.request.searchRegionRecommendation).length) ||
        (strip.request.searchV6 && Object.keys(strip.request.searchV6).length) ||
        (strip.request.enrollmentList && Object.keys(strip.request.enrollmentList).length) ||
        (strip.request.ids && Object.keys(strip.request.ids).length) ||
        (strip.request.recommendedCourses && Object.keys(strip.request.recommendedCourses).length))
    ) {
      return true
    }
    return false
  }

  processContentLikes(results: NsWidgetResolver.IRenderConfigWithAnyData[]): Promise<any> {
    const contentIds = {
      content_id:
        results.map(result => result.widgetData && result.widgetData.content.identifier) || [],
    }
    return this.contentSvc
      .fetchContentLikes(contentIds)
      .then(likeHash => {
        const likes = likeHash
        results.forEach(result => {
          result.widgetData.likes = likes[result.widgetData.content.identifier] || 0
        })
      })
      .catch(_err => { })
      .finally(() => Promise.resolve())
  }
}
