export namespace NSBrowseCompetency {
  export interface ICompetenciesJsonData {
    tabs: ICompetenciesTab[]
  }

  export interface ICompetenciesTab {
    name: string
    key: string
    badges: {
      enabled: boolean
      uri?: string
    }
    enabled: boolean
    routerLink: string
  }
  export interface ISearch {
    type: string
    field: string
    keyword: string
  }
  export interface ICompetencie {
    additionalProperties: { competencyType: string }
    competencyType?: string
    competencyArea?: string
    description: string
    id: string
    name: string
    source: null
    status: string
    type: string
  }
  export interface IWebResponse {
    errorMessage: string
    statusCode: number
    statusMessage: string
  }
  export interface ICompetencieResponse {
    responseData: ICompetencie[]
    statusInfo: IWebResponse
  }

}
