import { Component, Input, OnInit } from '@angular/core'
import { NsContent, NsDiscussionForum } from '@sunbird-cb/collection'
import { NsWidgetResolver } from '@sunbird-cb/resolver'
import { ActivatedRoute } from '@angular/router'
import { ConfigurationsService } from '@sunbird-cb/utils'

@Component({
  selector: 'viewer-resource-collection-container',
  templateUrl: './resource-collection.component.html',
  styleUrls: ['./resource-collection.component.scss'],
})
export class ResourceCollectionComponent implements OnInit {
  @Input() isFetchingDataComplete = false
  @Input() isErrorOccured = false
  @Input() forPreview = false
  @Input() resourceCollectionData: NsContent.IContent | null = null
  @Input() resourceCollectionManifest: any
  @Input() discussionForumWidget: NsWidgetResolver.IRenderConfigWithTypedData<
    NsDiscussionForum.IDiscussionForumInput
  > | null = null
  @Input() isPreviewMode = false
  isTypeOfCollection = false
  collectionId: string | null = null
  isRestricted = false
  constructor(private activatedRoute: ActivatedRoute, private configSvc: ConfigurationsService) { }
  ngOnInit() {
    if (this.configSvc.restrictedFeatures) {
      this.isRestricted =
        !this.configSvc.restrictedFeatures.has('disscussionForum')
    }
    this.isTypeOfCollection = this.activatedRoute.snapshot.queryParams.collectionType ? true : false
    if (this.isTypeOfCollection) {
      this.collectionId = this.activatedRoute.snapshot.queryParams.collectionId
    }
  }
}
