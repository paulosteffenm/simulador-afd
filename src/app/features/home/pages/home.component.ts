import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  public formGroupAddNodes = this.formBuilder.group({
    nodeName: ['', Validators.required]
  });

  public formGroupSelectFirstNode = this.formBuilder.group({
    nodes: [[], Validators.required]
  });

  public get nodes():any{
    return [];
  }

  constructor(private formBuilder: FormBuilder) { }

  public addNewNode(): void {

    const isNotEmpty = this.formGroupAddNodes.value.nodeName && this.formGroupAddNodes.value.nodeName?.length > 0;

    const newItem = this.nodes.find((node) => node === this.formGroupAddNodes.value.nodeName);

    if (isNotEmpty && !newItem) {
      this.nodes.push(this.formGroupAddNodes.value.nodeName!);
    }

    this.formGroupAddNodes.controls['nodeName'].setValue('');

  }

  public removeNode(nodeName: string): void {
    this.nodes = this.nodes.filter((node) => node !== nodeName);
  }
}
