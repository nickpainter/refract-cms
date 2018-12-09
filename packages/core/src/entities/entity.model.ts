// type AllowedType =
//   | number
//   | string
//   | Date
//   | Boolean
//   | number[]
//   | string[]
//   | Date[]
//   | Boolean[]
//   | {
//       [key: string]: AllowedType;
//     };

export interface Entity {
  _id: string;
  // [key: string]: AllowedType;
  updateDate: Date;
  createDate: Date;
}
