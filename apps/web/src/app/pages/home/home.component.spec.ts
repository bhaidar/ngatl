import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { Http, JsonpModule, BaseRequestOptions } from '@angular/http';
import { SharedModule } from '../../shared/shared.module';
import { HomeComponent } from './home.component';

export function httpFactory(backend, options) {
  return new Http(backend, options);
}

export const MOCK_BACKEND_PROVIDERS: any[] = [
  MockBackend,
  BaseRequestOptions,
  {
    provide: Http,
    useFactory: httpFactory,
    deps: [MockBackend, BaseRequestOptions]
  }
];

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [JsonpModule, SharedModule],
        declarations: [HomeComponent],
        providers: [MOCK_BACKEND_PROVIDERS]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
