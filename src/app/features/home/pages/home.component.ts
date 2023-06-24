import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Transition } from 'src/app/models/Transition';
import { AfdDiagramComponent } from 'src/app/shared/components/afd-diagram/afd-diagram.component';
import { AfdService } from 'src/app/shared/services/afd.service'; 7
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class HomeComponent {

  @ViewChild(AfdDiagramComponent) afdDiagramComponent!: AfdDiagramComponent;

  public nodeName: string = '';

  public nodes: Array<string> = [];

  public initialNodeName = '';

  public finalNodes: Array<string> = [];

  public transitions: Array<Transition> = [];

  public word: string = '';

  public showDiagram = false;

  public nodeList: Array<any> = [];

  public linkList: Array<any> = [];

  public diagram: go.Diagram | null = null

  public get isCompletedFirst(): boolean {
    return (this.nodes.length > 1);
  }

  public get isCompletedSecond(): boolean {
    return (this.initialNodeName.length > 0);
  }

  public get isCompletedThird(): boolean {
    return (this.finalNodes.length > 0);
  }

  public get isCompletedFourth(): boolean {
    return this.transitions.every((transition) => transition.Input && transition.To);
  }

  public get isDisabledRun(): boolean {
    return (this.word.length === 0)
  }

  constructor(
    private readonly matSnackBar: MatSnackBar,
    private readonly afdService: AfdService
  ) {

  }

  public addNewNode(): void {
    const nodeName = this.nodeName;

    if (nodeName?.length === 0) {
      this.openSnackBar('Node must have a name');
      return;
    }

    if (nodeName && nodeName?.length > 3) {
      this.openSnackBar('Node name must not be greater than 3');
      return;
    }

    const newItem = this.nodes.find((node) => node === nodeName);
    if (newItem) {
      this.openSnackBar('Item already exist');
      return;
    }

    this.nodes.push(nodeName!);

    const firstTransition = new Transition({
      From: nodeName!,
      Order: 'first'
    });

    const secondTransition = new Transition({ ...firstTransition, Order: 'second' });

    this.transitions.push(firstTransition);
    this.transitions.push(secondTransition);

    this.nodeName = '';

  }

  public removeNode(nodeName: string): void {
    this.nodes = this.nodes.filter((node) => node !== nodeName);

    this.transitions = this.transitions.filter((transition) => transition.From !== nodeName);
  }

  public setInitial(checked: boolean, nodeName: string): void {
    if (checked) {
      this.initialNodeName = nodeName;
    } else {
      this.initialNodeName = '';
    }

  }

  public setFinalNodes(checked: boolean, nodeName: string): void {
    if (checked) {
      this.finalNodes.push(nodeName);
    } else {
      this.finalNodes = this.finalNodes.filter((node) => node !== nodeName);
    }
  }

  public run(): void {
    this.showDiagram = false;

    try {
      this.afdService.run(
        this.word, this.initialNodeName, this.finalNodes, this.nodes, this.transitions
      );

      this.nodeList = [];
      this.linkList = [];

      this.nodes.forEach((node, index) => {
        this.nodeList.push({
          id: (index + 1),
          text: node,
          color: (node === this.initialNodeName) ? 'green' : (this.finalNodes.includes(node)) ? 'red' : 'white',
          category: 'simple'
        });
      })

      this.transitions.forEach((transition, index) => {
        this.linkList.push({
          id: (index + 1),
          from: this.nodeList.find((node) => node.text === transition.From?.toString()).id,
          to: this.nodeList.find((node) => node.text === transition.To?.toString()).id,
          progress: true
        });
      })

      console.log('nodeList', this.nodeList)
      console.log('linkList', this.linkList)

      setTimeout(() => {
        this.showDiagram = true;
      }, 1000);
    }
    catch (ex: any) {
      this.openSnackBar(ex.message)
    }

  }

  private openSnackBar(message = 'Error') {
    const durationInSeconds = 5;
    this.matSnackBar.open(message, 'X', {
      duration: durationInSeconds * 1000,
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }


}
