import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { HomeModule } from './home/home.module';

const modules: Array<any> = [
  SharedModule,
  HomeModule
]

@NgModule({
  imports: [
    ...modules
  ],
  exports: [
    ...modules
  ],
  declarations: []
})
export class FeaturesModule { }
