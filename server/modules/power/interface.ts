export interface PowerSettingStruct {
  id : number;
  uid: number;
  idCards: any;
  powerTypes: any;
  cardCategory: any;
}

export interface PowerTypeStruct {
  type: string;
  level: number;
  amount: number;
}

export interface IdCardStruct {
  id: string;
  type: string;
  use: any;
}
