import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ExcelTableService {
  public validate(data: any): boolean {
    if (data) {
      return true;
    }

    return false;
  }
}
