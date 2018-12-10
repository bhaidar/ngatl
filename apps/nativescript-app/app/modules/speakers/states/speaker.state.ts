import { Observable } from 'rxjs';
export namespace SpeakerState {

  export interface ISpeaker {
    "social"?: { twitter?: string; };
    "imageUrl"?: string;
    "twitter-link"?:string;
    "only-workshop-speaker"?: boolean;
    "_archived"?:boolean;
    "_draft"?: boolean;
    "position-company"?:string;
    "about"?:string;
    "name"?:string;
    "slug"?:string;
    "imageUrl$"?: Observable<any>;
    "photo"?:{  
       "fileId"?:string;
       "url"?:string;
    },
    "updated-on"?:string;
    "updated-by"?:string;
    "created-on"?:string;
    "created-by"?:string;
    "published-on"?:string;
    "published-by"?:string;
    "special-speaker"?:boolean;
    "_cid"?:string;
    "_id"?:string;
  }
  export interface IState {
    list?: Array<ISpeaker>;
    count?: number;
    selected?: ISpeaker;
    errors?: Array<any>;
  }

  export const initialState: IState = {
    list: [],
    errors: []
  };
}
