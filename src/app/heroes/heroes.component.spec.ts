import { async, ComponentFixture, TestBed, fakeAsync, flush } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HeroesComponent, HeroesPresenter, View } from './heroes.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Observable, defer } from 'rxjs';
import { Hero } from '../hero';

describe('HeroesComponent', () => {
  let component: HeroesComponent;
  let fixture: ComponentFixture<HeroesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeroesComponent ],
      imports: [RouterTestingModule.withRoutes([]), HttpClientTestingModule],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeroesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

describe('HeroesPresenter', () => {
  let p
  let view
  beforeEach(() => {
    view = new MockView()
    p = new HeroesPresenter(view)
    p.heroes = []
  })
  describe('add', () => {
    it('should not add anonymous hero', () => {
      p.add(' ')
      expect(p.heroes.length).toEqual(0)
    })

    it('should call addHeroToService of the view', () => {
      p.add('Jua')
      view.verify()
    })

    it('should add new hero to list of heroes', fakeAsync(() => {
      p.add('Jua')
      flush()
      expect(p.heroes.length).toEqual(1)
    }))
  })
});

class MockView implements View {
  called = false
  addHeroToService(hero: Hero): Observable<Hero> {
    this.called = true
    return asyncData<Hero>(hero)
  }
  verify(): void {
    expect(this.called).toBeTruthy()
  }
}

function asyncData<T>(data: T) {
  return defer(() => Promise.resolve(data));
}
