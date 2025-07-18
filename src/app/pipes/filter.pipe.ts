// src/app/pipes/filter.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  standalone: true
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], filter: Record<string, any>): any[] {
    if (!items || !filter) {
      return items;
    }

    const keys = Object.keys(filter);
    return items.filter(item => {
      return keys.every(key => {
        return item[key] === filter[key];
      });
    });
  }
}