// Do not change anything in the protected area. Doing so will be detected and your commit will be rejected.

// Protected Area Start
import { v4 as uuidv4 } from 'uuid';
import { IBlock } from './IBlock';
import { runEngine } from './RunEngine';
import { Message } from './Message';

export class Block implements IBlock {
  send: (message: Message) => void;

  blockId: string;

  constructor() {
    this.blockId = uuidv4();
    this.send = message => runEngine.sendMessage(this.blockId, message);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  receive(from: string, message: Message): void {}
}

// Protected Area End
