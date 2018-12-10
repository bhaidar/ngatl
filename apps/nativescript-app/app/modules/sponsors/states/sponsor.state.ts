import { Observable } from 'rxjs/Observable';
export namespace SponsorState {
  export interface ISponsor {
    "imageUrl"?: string;
    "url"?: string;
    "link-to-site"?:string;
    "color"?:string;
    "_archived"?:boolean;
    "_draft"?:boolean;
    "type-of-sponsor"?:string;
    "name"?:string;
    "imageUrl$"?: Observable<any>;
    "logo"?:{  
      "fileId":string;
      "url":string;
    },
    "slug"?:string;
    "updated-on"?:string;
    "updated-by"?:string;
    "created-on"?:string;
    "created-by"?:string;
    "published-on"?:string;
    "published-by"?:string;
    "_cid"?:string;
    "_id"?:string;
  }
  export interface IState {
    list?: Array<ISponsor>;
    count?: number;
    selected?: any;
    errors?: Array<any>;
  }

  export const initialState: IState = {
    list: [],
    errors: []
  };
}
