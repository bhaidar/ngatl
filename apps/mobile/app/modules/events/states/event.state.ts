export namespace EventState {
  export interface IEvent {
    id?:string;
    name?:string;
    created?:string;
    modified?:string;
    duration?:string;
    startTime?:string;
    startDate?: Date;
    endTime?:string;
    endDate?: Date;
    type?:string;
    room?:string;
    speaker?:string;
    isFavorite?: boolean;
    cssClass?: string;
  }
  
  export interface IState {
    list?: Array<IEvent>;
    count?: number;
    selected?: IEvent;
    errors?: Array<any>;
  }

  export const initialState: IState = {
    list: [],
    errors: []
  };
}
