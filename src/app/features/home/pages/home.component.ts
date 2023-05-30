import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  public formGroup = this.formBuilder.group({
    nodeName: ['', Validators.required]
  });

  public nodes: Array<string> = [];

  constructor(private formBuilder: FormBuilder) { }

  public addNewNode(): void {

    const isNotEmpty = this.formGroup.value.nodeName && this.formGroup.value.nodeName?.length > 0;

    const newItem = this.nodes.find((node) => node === this.formGroup.value.nodeName);

    if (isNotEmpty && !newItem) {
      this.nodes.push(this.formGroup.value.nodeName!);
    }

    this.formGroup.controls['nodeName'].setValue('');

  }
}
