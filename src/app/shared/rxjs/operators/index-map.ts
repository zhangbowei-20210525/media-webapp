import { map } from 'rxjs/operators';
import { PaginationResponseDto } from '@shared/dtos/response.dto';

export function indexMap<T extends PaginationResponseDto<R>, R>() {
  return map<T, T>(data => {
    if (data.list && data.pagination) {
      for (let index = 0; index < data.list.length; index++) {
        const element = data.list[index];
        element['displayIndex'] = (data.pagination.page - 1) * data.pagination.page_size + index + 1;
      }
    }
    return data;
  });
}
