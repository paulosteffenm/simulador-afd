import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Transition } from 'src/app/models/Transition';
import { AfdDiagramComponent } from 'src/app/shared/components/afd-diagram/afd-diagram.component';
import { AfdService } from 'src/app/shared/services/afd.service';7
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

  public get isDisabledRun(): boolean {
    return (this.word.length === 0)
  }

  constructor(
    private readonly matSnackBar: MatSnackBar,
    private readonly afdService: AfdService
  ) {

  }

  public addNewNode(): void {
    this.addDummyNode();
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
    this.afdService.run(
      this.word, this.initialNodeName, this.finalNodes, this.nodes, this.transitions
    );



  }

  private openSnackBar(message = 'Error') {
    const durationInSeconds = 5;
    this.matSnackBar.open(message, 'X', {
      duration: durationInSeconds * 1000,
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

  private addDummyNode() {
    const nodeData = {
      id: '4',
      text: '4',
      color: 'red',
      category: 'simple'
    };
    const listData = {
      key: -3,
      from: '3',
      to: '4',
    };
    this.afdDiagramComponent.addNewNode(nodeData, listData);
  }

  public nodeList = [
    { id: '1', text: '1', color: 'lightblue', category: 'simple' },
    { id: '2', text: '2', color: 'orange', category: 'simple' },
    { id: '3', text: '3', color: 'orange', category: 'simple' },
  ];
  public linkList = [
    { key: -1, from: '1', to: '2' },
    { key: -2, from: '2', to: '3' },
  ];
}
