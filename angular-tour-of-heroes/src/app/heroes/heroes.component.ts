import { Component, OnInit } from '@angular/core';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {
  heroes: Hero[] = [];

  constructor(private heroService: HeroService) { }

  ngOnInit() {
    this.getHeroes();
  }

  getHeroes(): void {
    this.heroService.getHeroes()
      .subscribe(heroes => this.heroes = heroes);
  }

  newHero = "";
  add(): void {
    let heroName = this.newHero.trim();
    if (!heroName) { return; }
    let aux : Hero = {id: 0, name: heroName};
    this.heroService.addHero(aux)
      .subscribe(hero => {
        this.heroes.push(hero);
        this.newHero = "";
      });
  }

  delete(hero: Hero): void {
    var result = confirm("Want to delete?");
    if (result) {
      this.heroes = this.heroes.filter(h => h !== hero);
      this.heroService.deleteHero(hero).subscribe();
    }
  }

}