import { PipeTransform, Pipe } from '@angular/core';
import { Task } from '../dominio/task.domain';

@Pipe({name:'filter'})
export class FilterPipe implements PipeTransform{
    transform(items: any[], searchText: string):any[] {
        if(!items) return [];
        if(!searchText) return items;
        searchText = searchText.toLowerCase();
        return items.filter(function(item:Task){
            return item.name.toLowerCase().includes(searchText);
        });
    }
    
}
