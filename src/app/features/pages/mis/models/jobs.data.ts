import { FormControl } from "@angular/forms"
import { Interface } from "node:readline"
export interface IJobs {
    id: number,
    title: string,
    url: string,
    isnew:boolean,
    enUrl: string,
    bnUrl: string
}
export interface ImgPayload {
    id: string,
    ImageName: string,
    Image : File
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
  companyName: string;
  showCompanyNameAs: string;
  companyNameBn: string;
  jobTitle: string;
  jobTitleBn: string;
  hotJobsUrl: string;
  comments: string;
  categoryJobIds: string;
  displayLogo: boolean;
  companyLogoId: null | string | number; // or just `any` if you're not sure
  numberOfJobs: number;
  hotJobsType: string;
  postedOptions: Array<Array<any>>; // or more specific type if you know the inner array structure
  displayPosition: string;
  publishedDate: string;
  jobDeadline: string;
  premiumStartDate: string;
  premiumEndDate: string;
  postedBy: string;
  sourcePerson: string;
}
export type HotJobFormControls = {
  companyName: FormControl<string>;
  showCompanyNameAs: FormControl<string>;
  companyNameBn: FormControl<string>;
  jobTitle: FormControl<string>;
  jobTitleBn: FormControl<string>;
  hotJobsUrl: FormControl<string>;
  comments: FormControl<string>;
  categoryJobIds: FormControl<string>;
  displayLogo: FormControl<boolean>;
  companyLogoId: FormControl<null | string | number>;
  numberOfJobs: FormControl<number>;
  hotJobsType: FormControl<string>;
  postedOptions: FormControl<Array<Array<any>>>;
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