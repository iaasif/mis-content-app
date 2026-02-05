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
    imageName: string,
    Image : File
}