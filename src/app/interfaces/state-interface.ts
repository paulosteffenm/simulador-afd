export interface StateInterface {
  diagramNodeData: Array<go.ObjectData>;
  diagramLinkData: Array<go.ObjectData>;
  diagramModelData: go.ObjectData;
  skipsDiagramUpdate: boolean
}
