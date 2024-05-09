import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabelaJogosComponent } from './tabela-jogos.component';

describe('TabelaJogosComponent', () => {
  let component: TabelaJogosComponent;
  let fixture: ComponentFixture<TabelaJogosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabelaJogosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TabelaJogosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
