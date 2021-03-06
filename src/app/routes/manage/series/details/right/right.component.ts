import { Component, OnInit } from '@angular/core';
import { PaginationDto, MessageService } from '@shared';
import { RightService } from './right.service';
import { Route, ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { fadeIn } from '@shared/animations';
import { TranslateService } from '@ngx-translate/core';
import { ACLAbility } from '@core/acl';

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
  ownDataSet: any;
  pubDataSet = [];
  pagination = { page: 1, page_size: 10 } as PaginationDto;
  allDataSet = [];
  customName: any;

  constructor(
    public ability: ACLAbility,
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
        // this.ownDataSet = result.own_rights;
        this.ownDataSet = result;
        const allDataRight = [];
        this.ownDataSet.right_groups.forEach(b => {
          console.log(b);
          this.allDataSet = b;
          allDataRight.push(this.allDataSet);
        });
        console.log(result);
      });
  }

  loadPublishRights() {
    this.isPublishLoading = true;
    this.service.getPublishRights(this.id, this.pagination).pipe(finalize(() => {
      this.isPublishLoading = false;
      this.isPublishLoaded = true;
    })).subscribe(result => {
      this.pubDataSet = result.list;
      console.log(result);
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
