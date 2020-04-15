import { Pipe, PipeTransform } from '@angular/core';
import { User } from './user';

@Pipe({
  name: 'displayName'
})
export class DisplayNamePipe implements PipeTransform {

  transform(user: User): string {
    if (user.display_name) {
      return user.display_name;
    } else {
      return `anonymous ${user.anon_display_name}`;
    }
  }

}
