import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroJogosComponent } from './cadastro-jogos.component';

describe('CadastroJogosComponent', () => {
  let component: CadastroJogosComponent;
  let fixture: ComponentFixture<CadastroJogosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroJogosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CadastroJogosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
