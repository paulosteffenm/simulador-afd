import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  initialArray: Array<string> = [];

  public formGroupAddNodes = this.formBuilder.group({
    nodeName: ['', Validators.required]
  });

  public formGroupSelectFirstNode = this.formBuilder.group({
    nodes: [this.initialArray, Validators.required]
  });

  public get nodes():any{
    return [];
  }

  constructor(private formBuilder: FormBuilder) { }

  public addNewNode(): void {

    const isNotEmpty = this.formGroupAddNodes.value.nodeName && this.formGroupAddNodes.value.nodeName?.length > 0;

    const newItem = this.formGroupSelectFirstNode.value.nodes!.find((node) => node === this.formGroupAddNodes.value.nodeName);

    if (isNotEmpty && !newItem) {
      this.formGroupSelectFirstNode.value.nodes!.push(this.formGroupAddNodes.value.nodeName!);
    }

    this.formGroupAddNodes.controls['nodeName'].setValue('');

  }

  public removeNode(nodeName: string): void {
    this.formGroupSelectFirstNode.controls['nodes'].setValue(
      this.formGroupSelectFirstNode.value.nodes!.filter((node) => node !== nodeName)
      );
  }
}
