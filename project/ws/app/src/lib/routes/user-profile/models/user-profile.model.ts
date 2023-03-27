export interface IUserProfileDetails {
  first_name: string
  last_name: string
  email: string
  wid: string
  department_name: string
}

export interface IUserProfileDetailsFromRegistry {
  'firstname': string,
  'motherTongue': string,
  'secondaryEmail': string,
  'gender': string,
  '@type': string,
  'mobile': number,
  'middlename': string,
  'telephone': number,
  'osid': string,
  'primaryEmailType': string,
  'knownLanguages': ILanguages[],
  'wid': string,
  'nationality': string,
  'surname': string,
  'dob': string,
  'category': string,
  'primaryEmail': string,
  'maritalStatus': string,
  'residenceAddress': string,
  'result': any
}

export interface ILanguages {
  name: string
}

export interface IChipItems {
  name: string
}

export interface ILanguagesApiData {
  languages: ILanguages[]
}

export interface INation {
  name: string
}
export interface INationality {
  name: string
  countryCode: string
}
export interface INationalityApiData {
  nationalities: INationality[]
}

export interface INameField {
  name: string
}

export interface IGovtOrgMeta {
  ministries: INameField[]
  service: INameField[]
  cadre: INameField[]
}
export interface IIndustriesMeta {
  industries: INameField[]
}

// tslint:disable-next-line: interface-name
export interface IdegreesMeta {
  graduations: INameField[]
  postGraduations: INameField[]
}
// tslint:disable-next-line: interface-name
export interface IdesignationsMeta {
  designations: INameField[]
  gradePay: INameField[]
}

export interface IProfileMetaApiData {
  govtOrg: IGovtOrgMeta
  industries: IIndustriesMeta
  degrees: IdegreesMeta
  designations: IdesignationsMeta
}

export interface IProfileAcademics {
  nameOfQualification: string,
  type: string,
  nameOfInstitute: string,
  yearOfPassing: string,
}
