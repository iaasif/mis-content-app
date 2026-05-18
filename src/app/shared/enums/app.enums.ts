import { isDevMode } from '@angular/core';

export enum Cookies {
  AUTH = 'AUTHTOKEN',
  REFTOKEN = 'REFTOKEN',
  MISAUTH = 'AuthTokenMIS',
}

export const RecruiterPanelUrl = 'https://recruiter.bdjobs.com/';



export enum ResponseType {
  Success = 'Success',
  Error = 'Error',
  True = 1,
  False = 0,
}

export enum ResponseCode {
  success = 1,
  Error = 0,
}

export enum PageType {
  All = 'al',
  NotViewed = 'nvwd',
  Viewed = 'vwd',
  Rejected = 'rej',
  Shortlist = 'sltyp',
  ActivityAssigned = 'sdu',
  ActivityNotAssigned = 'nsdu',
  ActivityRejected = 'rej',
  FinalSelectionList = 'flh',
  FinalSelectionHired = 'fh',
}

export const DefaultPageType = PageType.All;

export enum SType {
  All = 'al',
  Shortlist = 'sltyp',
  FinalSelection = 'flh',
  Online = 'onlinetest',
  AiAssessment = 'aiasmnt',
  Written = 'written',
  VideoRecord = 'record',
  FacetoFace = 'facetoface',
}

export const DefaultSType = SType.All;

export enum SIdentity {
  All = '0',
  Shortlist = '0',
  FinalSelection = '0',
}

export type CustomActivityType =
  | 'onlinetest'
  | 'aiasmnt'
  | 'written'
  | 'record'
  | 'facetoface';



export const CompanyIdLocalStorage = 'CompanyId';
export const JobNoLocalStorage = 'jobno';
export const UserId = 'UserId';
export const CompanyName = 'CompanyName';
export const CompanyLogoUrl = 'CompanyLogoUrl';
export const IsAdminUser = 'IsAdminUser';
export const Domain = isDevMode() ? 'test' : 'gateway';
export const ReviewQuesBeforeVideoInvite = 'ReviewQuesBeforeVideoInvite';

