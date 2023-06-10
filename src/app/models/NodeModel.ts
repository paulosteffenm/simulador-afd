import { Transition } from './Transition';

export class NodeModel {
  public Name?: string;
  public Initial?: boolean;
  public Final?: boolean;
  public Transitions:any = {};

  constructor(node?: Partial<NodeModel>) {
    Object.assign(this, node);
  }
  next(word:string) {
    if (!word) {
      if (!this.Final) {
        throw new Error("Reached last character in a non final node");
      }

      console.log("Finished");

      return;
    }

    const nextTransaction = this.Transitions[word[0]];
    if (!nextTransaction) {
      throw new Error("Impossible to continue, character: " + word[0]);
    }

    const nextSegment = word.slice(1, word.length);
    nextTransaction(nextSegment);
  }
};
