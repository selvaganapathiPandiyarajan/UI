import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  standalone: true
})
export class FilterPipe implements PipeTransform {

  transform(value: any, value2: any): any {
    if (!value2) {
      return value;
    }
    // if(value2 != value){
    //   alert("nod data Found");
    // }
    return value.filter((res: any) => {
      var searchfilter = (JSON.stringify(res).toLowerCase().includes(value2.toLowerCase()))
      return searchfilter;

    })
  }

}
