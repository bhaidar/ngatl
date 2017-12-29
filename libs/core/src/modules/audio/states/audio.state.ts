export namespace AudioState {
  export interface IState {
    playing: boolean;
    url?: string;
  }

  export const initialState: IState = {
    playing : false,
    url : null,
  };
}
