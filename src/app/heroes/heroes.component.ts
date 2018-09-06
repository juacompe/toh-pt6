import { Component, OnInit } from '@angular/core';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit, View {
  presenter: HeroesPresenter;

  constructor(private heroService: HeroService) {
    this.presenter = new HeroesPresenter(this)
  }

  ngOnInit() {
    this.getHeroes();
  }

  getHeroes(): void {
    this.heroService.getHeroes()
    .subscribe(heroes => this.presenter.heroes = heroes);
  }

  addHeroToService(hero: Hero): Observable<Hero> {
    return this.heroService.addHero(hero)
  }

  delete(hero: Hero): void {
    this.presenter.heroes = this.presenter.heroes.filter(h => h !== hero);
    this.heroService.deleteHero(hero).subscribe();
  }

}

export interface View {
  addHeroToService(hero: Hero): Observable<Hero>
}

export class HeroesPresenter {
  heroes: Hero[];

  constructor(private view: View) {}

  add(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.view.addHeroToService({ name } as Hero)
      .subscribe(hero => {
        this.heroes.push(hero);
      });
  }
}
