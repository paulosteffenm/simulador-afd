import { Injectable } from '@angular/core';
import { Transition } from 'src/app/models/Transition';
import { NodeModel } from 'src/app/models/NodeModel';
@Injectable({ providedIn: 'root' })
export class AfdService {

  public validate(data?: any): boolean {
    if (data) {
      return true;
    }

    return false;
  }

  public run(initialState: string, finalStates: Array<string>, availableNodes: Array<string>, transitions: Array<Transition>): any {
    const nodes: Array<NodeModel> = [];

    availableNodes.forEach((nodeName) => {
      const nodeTransitions = transitions.filter(
        (transition) => transition.From === nodeName
      );

      const currentNode = new NodeModel({
        Name: nodeName,
        Initial: nodeName === initialState,
        Final: finalStates.includes(nodeName)
      });

      nodeTransitions.forEach((transition) => {
        if (transition.Input) {
          currentNode.Transitions[transition.Input] = (word: string) => {
            const nextNode = nodes.find((node) => node.Name === transition.To);
            if (nextNode) {
              nextNode.next(word);
            } else {
              throw new Error('Next transition does not exist');
            }
          }
        }
      });

      nodes.push(currentNode);
    });

    const initialNode = nodes.find((node) => node.Initial);
    if (initialNode) {
      initialNode.next('01');
    } else {
      throw new Error('Initial transition does not exist');
    }

  }
}
