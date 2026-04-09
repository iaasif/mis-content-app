import { FormControl } from "@angular/forms"
export interface IJobs {
  id: number,
  title: string,
  url: string,
  isnew: boolean,
  enUrl: string,
  bnUrl: string
}
export interface ImgPayload {
  id: string,
  ImageName: string,
  Image: File
}
export interface UploadImgApiResponse {
  id: string
  profile: string | undefined
  variants: Variant[]
}

export interface Variant {
  width: number
  height: number
  contentType: string
  extension: string
  objectName: string
  gcsPath: string
  publicUrl: string
}
export interface UploadHtmlResponse {
  id: string
  objectName: string
  publicUrl: string
}
export interface HotJobForm {
  companyId: number | string ;
  companyName: string;
  showCompanyNameAs: string | null;
  companyNameBn: string | null;
  jobTitle: string;
  hotJobsUrl: string;
  comments: string | null;
  categoryJobIds: string;
  displayLogo: boolean;
  companyLogoId: null | string | number;
  numberOfJobs: number;
  hotJobsType: string;
  postedOptions: (string | boolean)[];
  displayPosition: string;
  publishedDate: string;
  jobDeadline: string;
  premiumStartDate: string;
  premiumEndDate: string;
  postedBy: string;
  sourcePerson: string;
}
export type HotJobFormControls = {
  companyId: FormControl<number | string>;
  companyName: FormControl<string>;
  showCompanyNameAs: FormControl<string | null>;
  companyNameBn: FormControl<string  | null>;
  jobTitle: FormControl<string>;
  hotJobsUrl: FormControl<string>;
  comments: FormControl<string | null>;
  categoryJobIds: FormControl<string>;
  displayLogo: FormControl<boolean>;
  companyLogoId: FormControl<null | string | number>;
  numberOfJobs: FormControl<number>;
  hotJobsType: FormControl<string>;
  postedOptions: FormControl<(string | boolean)[]>;
  displayPosition: FormControl<string>;
  publishedDate: FormControl<string>;
  jobDeadline: FormControl<string>;
  premiumStartDate: FormControl<string>;
  premiumEndDate: FormControl<string>;
  postedBy: FormControl<string>;
  sourcePerson: FormControl<string>;
};

export type newCompanyForm = {
  companyName: string;
  companyNameBn: string;
  companyLogo: boolean;
  logoSource: null | string;
  logoSize: number;
}

export interface CreateCompany {
  CompanyName: string;
  LogoSource?: string | null;
  LogoH?: number | null;
  LogoW?: number | null;
  LogoSize?: number | null;
  LogoSourceLocal?: string | null;
  CompanyNameBng?: string | null;
}

export interface CompanySuggestion {
  comId: number;
  companyName: string;
  companyNameBng: string | null;
  displayCompanyName: string | null;
}

export interface HotJob {
  id: number
  companyName: string
  jobTitles: string
  serialNo: number
  premiumJob: number
  postedOn: string
  startDate: string
  endDate: string
}
export interface SourcePerson {
  userId: number;
  fullName: string;
  depSerial: number;
}

export interface postedBy {
  userId : number;
  fullName: string
}

export interface HotJobCreationResponse {
  id: number;
  message: string;
}
