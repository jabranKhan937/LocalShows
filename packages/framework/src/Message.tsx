import { v4 as uuidv4 } from 'uuid';

export class Message {
  id: string;

  properties: any;

  messageId: string;

  constructor(id: string) {
    this.id = id;
    this.properties = {};
    this.messageId = uuidv4();
  }

  addData(key: any, value: any) {
    this.properties[key] = value;
  }

  getData(key: any) {
    let val = this.properties[key];
    if (val) {
      return val;
    }
  }

  initializeFromObject = (from: any) => {
    this.properties = { ...this.properties, ...from };
  };

  copyAllPropertiesOf(from: Message) {
    Object.entries(from.properties).map(([key, value]) => {
      return this.addData(key, value);
    });
  }
}
