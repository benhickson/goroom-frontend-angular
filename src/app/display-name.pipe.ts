import { Pipe, PipeTransform } from '@angular/core';
import { User } from './user';
import { pipe } from 'rxjs';

@Pipe({
  name: 'displayName'
})
export class DisplayNamePipe implements PipeTransform {

  transform(user: User): string {
    if (user.display_name) {
      return user.display_name;
    } else {
      const string: string = `anonymous ${user.anon_display_name}`;
      // title case the name
      return string.replace(/(^|\s)\S/g, function(t) { return t.toUpperCase() });
    }
  }

}
