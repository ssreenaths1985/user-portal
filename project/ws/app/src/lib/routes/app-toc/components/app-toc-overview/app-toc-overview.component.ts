import { AccessControlService } from '@ws/author'
import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'
import { ActivatedRoute, Data } from '@angular/router'
import { NsContent } from '@sunbird-cb/collection'
import { ConfigurationsService } from '@sunbird-cb/utils'
import { Observable, Subscription } from 'rxjs'
import { NsAppToc } from '../../models/app-toc.model'
import { AppTocService } from '../../services/app-toc.service'

@Component({
  selector: 'ws-app-app-toc-overview',
  templateUrl: './app-toc-overview.component.html',
  styleUrls: ['./app-toc-overview.component.scss'],
})
export class AppTocOverviewComponent implements OnInit, OnDestroy {
  content: NsContent.IContent | null = null
  routeSubscription: Subscription | null = null
  viewMoreRelatedTopics = false
  hasTocStructure = false
  tocStructure: NsAppToc.ITocStructure | null = null
  askAuthorEnabled = true
  trainingLHubEnabled = false
  trainingLHubCount$?: Observable<number>
  body: SafeHtml | null = null
  @Input() forPreview = false
  tocConfig: any = null
  contentParents: { [key: string]: NsAppToc.IContentParentResponse[] } = {}
  objKeys = Object.keys

  constructor(
    private route: ActivatedRoute,
    private tocSharedSvc: AppTocService,
    private configSvc: ConfigurationsService,
    private domSanitizer: DomSanitizer,
    private authAccessControlSvc: AccessControlService,
  ) {
    if (this.configSvc.restrictedFeatures) {
      this.askAuthorEnabled = !this.configSvc.restrictedFeatures.has('askAuthor')
      this.trainingLHubEnabled = !this.configSvc.restrictedFeatures.has('trainingLHub')
    }
  }

  ngOnInit() {
    if (!this.forPreview) {
      this.forPreview = window.location.href.includes('/author/')
    }
    if (this.route && this.route.parent) {
      this.routeSubscription = this.route.parent.data.subscribe((data: Data) => {
        this.initData(data)
        this.tocConfig = data.pageData.data
      })
    }
  }

  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe()
    }
  }

  get showSubtitleOnBanner() {
    return this.tocSharedSvc.subtitleOnBanners
  }
  get showDescription() {
    if (this.content && !this.content.body) {
      return true
    }
    return this.tocSharedSvc.showDescription
  }

  private initData(data: Data) {
    const initData = this.tocSharedSvc.initData(data)
    this.content = initData.content
    this.body = this.domSanitizer.bypassSecurityTrustHtml(
      this.content && this.content.body
        ? this.forPreview
          ? this.authAccessControlSvc.proxyToAuthoringUrl(this.content.body)
          : this.content.body
        : '',
    )
    this.contentParents = {}
    this.resetAndFetchTocStructure()
    this.getTrainingCount()
    this.getContentParent()
  }

  getContentParent() {
    if (this.content) {
      const contentParentReq: NsAppToc.IContentParentReq = {
        fields: ['contentType', 'name'],
      }
      this.tocSharedSvc
        .fetchContentParent(this.content.identifier, contentParentReq, this.forPreview)
        .subscribe(
          res => {
            this.parseContentParent(res)
          },
          _err => {
            this.contentParents = {}
          },
        )
    }
  }

  parseContentParent(content: NsAppToc.IContentParentResponse) {
    content.collections.forEach(collection => {
      if (!this.contentParents.hasOwnProperty(collection.contentType)) {
        this.contentParents[collection.contentType] = []
      }
      this.contentParents[collection.contentType].push(collection)
      this.parseContentParent(collection)
    })
  }

  resetAndFetchTocStructure() {
    this.tocStructure = {
      assessment: 0,
      finalTest: 0,
      course: 0,
      handsOn: 0,
      interactiveVideo: 0,
      learningModule: 0,
      other: 0,
      pdf: 0,
      survey: 0,
      podcast: 0,
      practiceTest: 0,
      quiz: 0,
      video: 0,
      webModule: 0,
      webPage: 0,
      youtube: 0,
      interactivecontent: 0,
    }
    if (this.content) {
      this.hasTocStructure = false
      this.tocStructure.learningModule = this.content.primaryCategory === NsContent.EPrimaryCategory.MODULE ? -1 : 0
      this.tocStructure.course = this.content.primaryCategory === NsContent.EPrimaryCategory.COURSE ? -1 : 0
      this.tocStructure = this.tocSharedSvc.getTocStructure(this.content, this.tocStructure)
      for (const progType in this.tocStructure) {
        if (this.tocStructure[progType] > 0) {
          this.hasTocStructure = true
          break
        }
      }
    }
  }

  // For Learning Hub trainings
  private getTrainingCount() {
    if (
      this.trainingLHubEnabled &&
      this.content &&
      // this.trainingSvc.isValidTrainingContent(this.content) &&
      !this.forPreview
    ) {
      // this.trainingLHubCount$ = this.trainingApi
      //   .getTrainingCount(this.content.identifier)
      //   .pipe(retry(2))
    }
  }
}
