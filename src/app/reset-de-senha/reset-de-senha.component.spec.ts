import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetDeSenhaComponent } from './reset-de-senha.component';

describe('ResetDeSenhaComponent', () => {
  let component: ResetDeSenhaComponent;
  let fixture: ComponentFixture<ResetDeSenhaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResetDeSenhaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResetDeSenhaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
