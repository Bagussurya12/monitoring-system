import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {

  @Input() perPage: any = null;
  @Input() totalItems: any = null;
  @Input() currentPage: any = null;
  @Output() selectedPage = new EventEmitter<any>();

  totalPages: number = 0;
  roundedTotalPages: number = 0;
  pages: any = [];

  constructor(private router: Router) {

  }

  setPageParams(page: any) {
    this.router.navigate([], {
      queryParams: {
        page: page
      },
      queryParamsHandling: 'merge',
    });
  }

  selectPage(page: any) {
    if (page <= 0) {
      return;
    }

    this.setPageParams(page);

    this.selectedPage.emit(page);
  }

  private getPages(current: any, total: number): number[] {
    if (total <= 10) {
      return [...Array(total).keys()].map(x => ++x)
    }

    current = parseInt(current);

    if (current >= 8) {
      if (current >= total - 4) {
        return [1, -1, total - 5, total - 4, total - 3, total - 2, total - 1, total];
      } else {
        return [1, -1, current - 3, current - 2, current - 1, current, current + 1, current + 2, current + 3, -1, total];
      }
    }

    return [1, 2, 3, 4, 5, 6, 7, 8, -1, total];
  }

  ngOnInit() {
    this.totalPages = this.totalItems / this.perPage;
    this.roundedTotalPages = Math.ceil(this.totalPages);

    this.pages = this.getPages(this.currentPage, this.roundedTotalPages);

    this.setPageParams(this.currentPage);
  }

}
