import { Component, OnInit } from '@angular/core';

const GENERIC_SEARCH_RESULTS = ['Harry Potter', 'The Dark Knight'];

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  text: string = '';
  results: string[] = [];

  constructor() {}

  ngOnInit(): void {}

  search(event: any) {
    this.results = GENERIC_SEARCH_RESULTS;
  }

  onSearchSelect(event: any) {
    console.log(event);
  }
}
