import { PipeTransform, Pipe } from '@angular/core';
import { UserNick } from '../dominio/user.domain';

@Pipe({name:'filter'})
export class FilterPipe implements PipeTransform{
    transform(items: any[], searchText: string):any[] {
        if(!items) return [];
        if(!searchText) return items;
        searchText = searchText.toLowerCase();
        return items.filter(function(item:UserNick){
            return item.nick.toLowerCase().includes(searchText);
        });
    }

}
