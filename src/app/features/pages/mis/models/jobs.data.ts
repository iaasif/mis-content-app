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