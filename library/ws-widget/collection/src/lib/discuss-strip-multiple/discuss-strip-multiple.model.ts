import { NsWidgetResolver } from '@sunbird-cb/resolver'
// import { NSSearch } from '../_services/widget-search.model'
import { NsCardContent } from '../card-content/card-content.model'

export namespace NsDiscussStripNewMultiple {
  export interface IDiscussMultiple {
    errorWidget?: NsWidgetResolver.IRenderConfigWithAnyData
    loader?: boolean
    noDataWidget?: NsWidgetResolver.IRenderConfigWithAnyData
    strips: IDiscussStripUnit[]
    isChannelStrip?: boolean
  }
  export interface IDiscussStripUnit {
    key: string
    title: string
    titleDescription?: string
    name?: string
    mode?: 'accordion'
    info?: IStripInfo
    logo?: string
    preWidgets?: NsWidgetResolver.IRenderConfigWithAnyData[]
    postWidgets?: NsWidgetResolver.IRenderConfigWithAnyData[]
    stripConfig?: IStripConfig
    canHideStrip?: boolean
    filters?: any[]
    selectAll?: boolean | null
    request?: {
      // search?: NSSearch.ISearchRequest
      // searchV6?: NSSearch.ISearchV6Request
      // searchRegionRecommendation?: NSSearch.ISearchOrgRegionRecommendationRequest
      api?: IStripRequestApi
      // ids?: string[]
    }
    searchV6Type?: 'KB' | 'Collections' | 'searchQuery' | null
    stripBackground?: string
    noDataWidget?: NsWidgetResolver.IRenderConfigWithAnyData
    loader?: boolean
    errorWidget?: NsWidgetResolver.IRenderConfigWithAnyData
    refreshEvent?: Record<'eventType' | 'from', string>
    fetchLikes?: boolean
    viewMoreUrl: {
      viewMoreText: string
      path: string
      queryParams: any
    } | null
    description: any
    stripLogo: any
  }
  export interface IStripRequestApi {
    path: string
    queryParams?: {
      pageNo?: number
      pageSize?: number
      pageState?: string
      sourceFields?: string
    }
  }

  export interface IStripInfo {
    mode: 'below' | 'popup' | 'modal'
    visibilityMode?: 'hidden' | 'visible'
    icon: {
      icon: string
      scale: number
      style?: any // added for UI
    }
    widget: NsWidgetResolver.IRenderConfigWithAnyData
  }
  interface IStripConfig {
    // card subType key is used to determine the Network Card display type
    cardSubType: NsCardContent.TCardSubType
    // to show view more card for a search strip
    postCardForSearch?: boolean
    intranetMode?: 'greyOut' | 'hide'
    deletedMode?: 'greyOut' | 'hide'
    // contentTags?: IContentTags
  }
  export interface INetworkStripResponseApi {
    // contents: NsContent.IContent[]
    contents: any
    hasMore?: boolean
    pageState?: string
    totalHits?: number
  }
}
