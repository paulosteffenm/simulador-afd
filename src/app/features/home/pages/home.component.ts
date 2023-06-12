import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Transition } from 'src/app/models/Transition';
import { AfdService } from 'src/app/shared/services/afd.service';7
import * as go from 'gojs'
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class HomeComponent {

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
    private readonly formBuilder: FormBuilder,
    private readonly matSnackBar: MatSnackBar,
    private readonly afdService: AfdService
  ) {

  }

  public addNewNode(): void {
    console.log("AAAAAAAAAA", this.diagram)
    this.state.diagramNodeData.push(
      { id: 'q0', text: "q0", color: 'orange' },
      { id: 'q1', text: "q1", color: 'orange' },
    )
    this.state.diagramLinkData.push( {
      from: 'Beta',
      to: 'q1',
      key: 1
    })


    this.state.diagramLinkData.push( {
      from: 'q0',
      to: 'q1',
      key: 1
    })
    // update statex

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


  // Big object that holds app-level state data
  // As of gojs-angular 2.0, immutability is required of state for change detection
  public state = {
    // Diagram state props
    diagramNodeData: [
      { id: 'Alpha', text: "Alpha", color: 'lightblue' },
      { id: 'Beta', text: "Beta", color: 'orange' }
    ],
    diagramLinkData: [
      { key: -1, from: 'Alpha', to: 'Beta' }
    ],
    diagramModelData: { prop: 'value' },
    skipsDiagramUpdate: false,

    // Palette state props
    paletteNodeData: [
      { key: 'PaletteNode1', color: 'firebrick' },
      { key: 'PaletteNode2', color: 'blueviolet' }
    ]
  }; // end state object

  public diagramDivClassName: string = 'myDiagramDiv';
  public paletteDivClassName = 'myPaletteDiv';

  // initialize diagram / templates

  public initDiagram(): go.Diagram {
    console.log('init')
    const $ = go.GraphObject.make;
    const dia = new go.Diagram({
      'undoManager.isEnabled': true,
      model: new go.GraphLinksModel(
        {
          nodeKeyProperty: 'id',
          linkKeyProperty: 'key' // IMPORTANT! must be defined for merges and data sync when using GraphLinksModel
        }
      )
    });

    // define the Node template
    dia.nodeTemplate =
      $(go.Node, 'Auto',
        $(go.Shape, 'RoundedRectangle', { stroke: null },
          new go.Binding('fill', 'color')
        ),
        $(go.TextBlock, { margin: 8, editable: true },
          new go.Binding('text').makeTwoWay())
      );

    return dia;
  }


  /**
   * Handle GoJS model changes, which output an object of data changes via Mode.toIncrementalData.
   * This method should iterate over thoe changes and update state to keep in sync with the FoJS model.
   * This can be done with any preferred state management method, as long as immutability is preserved.
   */
  public diagramModelChange = function (changes: go.IncrementalData) {
    console.log(changes);
    // see gojs-angular-basic for an example model changed handler that preserves immutability
    // when setting state, be sure to set skipsDiagramUpdate: true since GoJS already has this update
  };

  public initPalette(): go.Palette {
    const $ = go.GraphObject.make;
    const palette = $(go.Palette);

    // define the Node template
    palette.nodeTemplate =
      $(go.Node, 'Auto',
        $(go.Shape, 'RoundedRectangle', { stroke: null },
          new go.Binding('fill', 'color')
        ),
        $(go.TextBlock, { margin: 8 },
          new go.Binding('text', 'key'))
      );

    palette.model = new go.GraphLinksModel(
      {
        linkKeyProperty: 'key'  // IMPORTANT! must be defined for merges and data sync when using GraphLinksModel
      });

    return palette;
  }
}
