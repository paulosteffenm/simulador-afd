import { NgModule } from '@angular/core';
import { PageHeaderComponent } from './components/page-header/page-header.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBarModule} from '@angular/material/snack-bar';
import { GojsAngularModule } from 'gojs-angular';
import { AfdDiagramComponent } from './components/afd-diagram/afd-diagram.component';

const components = [
  PageHeaderComponent,
  AfdDiagramComponent
]

const modules = [
  MatToolbarModule,
  MatSnackBarModule,
  GojsAngularModule
];

@NgModule({
  declarations: [
    ...components
  ],
  providers: [],
  imports: [
    ...modules
  ],
  exports:[
    ...components
  ]
})
export class SharedModule { }
