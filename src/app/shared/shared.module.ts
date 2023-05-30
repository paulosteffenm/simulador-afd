import { NgModule } from '@angular/core';
import { PageHeaderComponent } from './components/page-header/page-header.component';
import { MatToolbarModule } from '@angular/material/toolbar';

const components = [
  PageHeaderComponent
]

@NgModule({
  declarations: [
    ...components
  ],
  providers: [],
  imports: [
    MatToolbarModule
  ],
  exports:[
    ...components
  ]
})
export class SharedModule { }
