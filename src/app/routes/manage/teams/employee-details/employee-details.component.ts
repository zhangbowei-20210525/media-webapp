import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmployeeDetailsService } from './employee-details.service';
import { dtoMap, dtoCatchError } from '@shared';

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.less']
})
export class EmployeeDetailsComponent implements OnInit {

  employeeId: number;
  employee: any;

  constructor(
    private route: ActivatedRoute,
    private service: EmployeeDetailsService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.employeeId = +params.get('id');
      this.fetchEmployeeDetails();
    });
  }

  fetchEmployeeDetails() {
    this.service.getEmployeeDetailsMock(this.employeeId as any)
      .pipe(dtoMap(e => e.data), dtoCatchError())
      .subscribe(result => {
        this.employee = result;
        console.log(result);
      });
  }

  sliceTagName(tag: string): string {
    const isLongTag = tag.length > 20;
    return isLongTag ? `${tag.slice(0, 20)}...` : tag;
  }

  handleClose(department) {
    console.log(department);
  }

  addDepartments() {
    
  }

}
