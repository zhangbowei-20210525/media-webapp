import { finalize, delay } from 'rxjs/operators';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { SeriesSelectorService } from './series-selector.service';
import { SeriesBriefDto, SearchMetaDataDto } from './dtos';
import { SettingsService } from '@core';
import { NzDrawerRef } from 'ng-zorro-antd';

@Component({
  selector: 'app-series-selector',
  templateUrl: './series-selector.component.html',
  styleUrls: ['./series-selector.component.less']
})
export class SeriesSelectorComponent implements OnInit {

  @Input() autoSelect: boolean;
  @Output() tagChange = new EventEmitter<{ checked: boolean, tag: SeriesBriefDto }>();
  isSeriesLoading: boolean;
  originSeries: SeriesBriefDto[];
  @Input() series: SeriesBriefDto[];
  @Output() seriesChange = new EventEmitter<SeriesBriefDto[]>();
  // @Output() selectedSeriesChange = new EventEmitter<SeriesBriefDto[]>();
  programTypes: SearchMetaDataDto[];
  releaseYears: SearchMetaDataDto[];
  selectedType: string;
  selectedYear: string;
  validReleaseYears: string[];
  searchText = '';

  constructor(
    private service: SeriesSelectorService,
    private settings: SettingsService,
    private drawerRef: NzDrawerRef
  ) { }

  get checkedSeries() {
    return this.series.filter(item => item.status);
  }

  ngOnInit() {
    this.isSeriesLoading = true;
    this.service.getSeries(this.settings.user.employee_id)
      .pipe(finalize(() => this.isSeriesLoading = false))
      .subscribe(result => {
        if (!this.autoSelect) {
          result.list.forEach(item => item.status = false);
        }
        this.series = result.list;
        this.emitSeriesChange();
        this.originSeries = result.list;
        this.programTypes = result.meta.program_type_choices;
        this.releaseYears = result.meta.release_year_choices;
        this.selectedType = this.programTypes[0].code;
        this.selectedYear = this.releaseYears[0].code;
        this.validReleaseYears = this.releaseYears.filter(e => !e.code.startsWith('@')).map(e => e.code);
      });
  }

  emitSeriesChange() {
    this.seriesChange.emit(this.series);
    // this.selectedSeriesChange.emit(this.series.filter(e => e.status));
  }

  handleChange(checked: boolean, tag: SeriesBriefDto): void {
    this.tagChange.emit({ checked, tag });
  }

  handleTypeChange(type: string) {
    this.series = this.originSeriesfilter(type, this.selectedYear, this.searchText);
    this.emitSeriesChange();
  }

  handleYearChange(year: string) {
    this.series = this.originSeriesfilter(this.selectedType, year, this.searchText);
    this.emitSeriesChange();
  }

  search() {
    this.series = this.originSeriesfilter(this.selectedType, this.selectedYear, this.searchText);
    this.emitSeriesChange();
  }

  selectType(s: SeriesBriefDto, type: string): boolean {
    if (type === '@all') {
      return true;
    } else {
      return s.program_type === type;
    }
  }

  selectYear(s: SeriesBriefDto, year: string): boolean {
    if (year === '@all') {
      return true;
    } else if (year === '@other') {
      return this.validReleaseYears.indexOf(year) === -1;
    } else {
      return s.year === year;
    }
  }

  selectText(s: SeriesBriefDto, text: string) {
    if (text && text.length > 0) {
      return s.name.indexOf(text) > -1;
    } else {
      return true;
    }
  }

  originSeriesfilter(type: string, year: string, searchText: string) {
    return this.originSeries.filter(e =>
      this.selectType(e, type)
      && this.selectYear(e, year)
      && this.selectText(e, searchText)
    );
  }

  close() {
    if (this.drawerRef) {
      this.drawerRef.close();
    }
  }

  confirm() {
    if (this.drawerRef) {
      this.drawerRef.close(this.checkedSeries);
    }
  }

}
