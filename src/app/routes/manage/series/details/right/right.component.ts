import { Component, OnInit } from '@angular/core';
import { PaginationDto, MessageService } from '@shared';
import { RightService } from './right.service';
import { Route, ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { fadeIn } from '@shared/animations';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-right',
  templateUrl: './right.component.html',
  styleUrls: ['./right.component.less'],
  animations: [fadeIn]
})
export class RightComponent implements OnInit {

  id: number;
  isOwnLoaded = false;
  isPublishLoaded = false;
  isPublishLoading: boolean;
  ownDataSet = [];
  pubDataSet = [];
  pagination = { page: 1, page_size: 10 } as PaginationDto;

  constructor(
    private service: RightService,
    private route: ActivatedRoute,
    private message: MessageService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.route.parent.paramMap.subscribe(param => {
      this.id = +param.get('sid');
      this.loadOwnRights();
      this.loadPublishRights();
    });
  }

  loadOwnRights() {
    this.service.getOwnRights(this.id)
      .pipe(finalize(() => this.isOwnLoaded = true))
      .subscribe(result => {
        this.ownDataSet = result.own_rights;
      });
  }

  loadPublishRights() {
    this.isPublishLoading = true;
    this.service.getPublishRights(this.id, this.pagination).pipe(finalize(() => {
      this.isPublishLoading = false;
      this.isPublishLoaded = true;
    })).subscribe(result => {
      this.pubDataSet = result.list;
      this.pagination = result.pagination;
    });
  }

  fetchPublishRights() {
    this.isPublishLoading = true;
    this.service.getPublishRights(this.id, this.pagination)
      .pipe(finalize(() => this.isPublishLoading = false))
      .subscribe(result => {
        this.pubDataSet = result.list;
        this.pagination = result.pagination;
      });
  }

  deleteOwnRight(id: number) {
    this.service.deleteOwnRights(id).subscribe(() => {
      this.message.success(this.translate.instant('global.delete-successfully'));
      this.loadOwnRights();
    });
  }

  deletePublishRight(id: number) {
    this.service.deletePublishRights(id).subscribe(() => {
      this.message.success(this.translate.instant('global.delete-successfully'));
      this.loadPublishRights();
    });
  }

  pageChange(index: number) {
    this.pagination.page = index;
    this.fetchPublishRights();
  }

}
