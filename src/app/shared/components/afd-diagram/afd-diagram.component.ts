import { ChangeDetectorRef, Component, Input, ViewChild } from '@angular/core';
import * as go from 'gojs'
import produce from 'immer';
import { DataSyncService, DiagramComponent } from 'gojs-angular';
import { StateInterface } from 'src/app/interfaces/state-interface';
@Component({
  selector: 'app-afd-diagram',
  templateUrl: './afd-diagram.component.html',
  styleUrls: ['./afd-diagram.component.scss']
})
export class AfdDiagramComponent {

  @Input() set nodeList(list: Array<go.ObjectData>) {
    this.state.diagramNodeData = list;
  }
  @Input() set linkList(list: Array<go.ObjectData>) {
    this.state.diagramLinkData = list;
  }
  @ViewChild('myDiagram', { static: true })
  public myDiagramComponent!: DiagramComponent;

  public goObject = go;

  public state:StateInterface = {
    diagramNodeData: [],
    diagramLinkData: [],
    diagramModelData: {},
    skipsDiagramUpdate: false,
  };

  public diagramDivClassName: string = 'myDiagramDiv';

  constructor(private cdr: ChangeDetectorRef) {

    this.initDiagram = this.initDiagram.bind(this);
  }

  ngAfterViewInit() {
    console.log('ngAfterViewInit library');
    this.cdr.detectChanges();
  }

  // initialize diagram / templates
  public initDiagram(): go.Diagram {
    const self = this;
    const $ = go.GraphObject.make;
    const dia = $(go.Diagram, {
      'undoManager.isEnabled': true,
      initialAutoScale: go.Diagram.Uniform,
      'contextMenuTool.findObjectWithContextMenu': function (obj:any) {
        const result =
          go.ContextMenuTool.prototype.findObjectWithContextMenu.call(
            this,
            obj
          ) as any;
        if (result?.part?.data?.id == 3) {
          return null;
        }
        return result;
      },
      'contextMenuTool.showContextMenu': function (cm:any, obj:any) {
        go.ContextMenuTool.prototype.showContextMenu.call(this, cm, obj);
      },
      layout: $(go.TreeLayout, { angle: 90 }),
      model: $(go.GraphLinksModel, {
        nodeKeyProperty: 'id',
        linkKeyProperty: 'key', // IMPORTANT! must be defined for merges and data sync when using GraphLinksModel
      }),
    });
    dia.contextMenu = $(
      'ContextMenu',
      $(
        'ContextMenuButton',
        $(go.TextBlock, { margin: 5, alignment: go.Spot.Left }, 'Dummy action')
      )
    );

    const preBuiltemplate = $(
      go.Node,
      'Auto',
      {
        contextMenu: $(
          'ContextMenu',
          $(
            'ContextMenuButton',
            $(
              go.TextBlock,
              { margin: 5, alignment: go.Spot.Left },
              'Dummy action'
            )
          )
        ),
      },
      $(go.Shape, 'Ellipse', new go.Binding('fill', 'color')),
      $(
        go.TextBlock,
        { margin: 8, editable: true },
        new go.Binding('text').makeTwoWay()
      )
    );

    // create the nodeTemplateMap, holding one prebuilt node templates:
    const templmap = new go.Map<string, go.Node>();
    // for each of the node categories, specify which template to use
    templmap.add('simple', preBuiltemplate);
    // for the default category, "", use the same template that Diagrams use by default;
    // this just shows the key value as a simple TextBlock
    templmap.add('', dia.nodeTemplate as go.Node);
    dia.nodeTemplateMap = templmap;
    return dia;
  }

  // When the diagram model changes, update app data to reflect those changes. Be sure to use immer's "produce" function to preserve immutability
  diagramModelChange(changes: go.IncrementalData) {
    this.state = produce(this.state, (draft) => {
      draft.skipsDiagramUpdate = true;
      draft.diagramNodeData = DataSyncService.syncNodeData(
        changes,
        draft.diagramNodeData as Array<go.ObjectData>,
        this.myDiagramComponent.diagram.model
      ) as any;
      draft.diagramLinkData = DataSyncService.syncLinkData(
        changes,
        draft.diagramLinkData as Array<go.ObjectData>,
        this.myDiagramComponent.diagram.model as go.GraphLinksModel
      ) as any;
      draft.diagramModelData = DataSyncService.syncModelData(
        changes,
        draft.diagramModelData
      );
    });
  }

  addNewNode(nodeData: go.ObjectData, linkData: go.ObjectData | null = null) {
    this.myDiagramComponent.diagram.startTransaction('make new node');
    this.myDiagramComponent.diagram.model.addNodeData(nodeData);
    if (linkData) {
      (this.myDiagramComponent.diagram.model as go.GraphLinksModel).addLinkData(
        linkData
      );
    }
    this.myDiagramComponent.diagram.commitTransaction('make new node');
  }
}
