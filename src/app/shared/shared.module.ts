import { NgModule } from '@angular/core';
import { PageHeaderComponent } from './components/page-header/page-header.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBarModule} from '@angular/material/snack-bar';

const components = [
  PageHeaderComponent
]

@NgModule({
  declarations: [
    ...components
  ],
  providers: [],
  imports: [
    MatToolbarModule,
    MatSnackBarModule
  ],
  exports:[
    ...components
  ]
})
export class SharedModule { }
