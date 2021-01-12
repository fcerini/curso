import { Component, OnInit } from '@angular/core';

import { Observable, of, Subject } from 'rxjs';

import {
   debounceTime, distinctUntilChanged, switchMap, timeout
 } from 'rxjs/operators';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: [ './hero-search.component.css' ]
})
export class HeroSearchComponent implements OnInit {

  heroes: Hero[] =[];

  constructor(private heroService: HeroService) {}

  search(term: string): void {
    this.heroService.searchHeroes(term).subscribe(
      (lista) => {this.heroes = lista}
    )
  }

  ngOnInit(): void {
  }
}