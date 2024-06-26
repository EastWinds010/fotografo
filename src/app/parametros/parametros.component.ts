import { Component, OnInit } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ListboxModule } from 'primeng/listbox';
import { FormsModule } from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';
import { AccordionModule } from 'primeng/accordion';
import { CardModule } from 'primeng/card';
import { PanelModule } from 'primeng/panel';
import { CalendarModule } from 'primeng/calendar';
import { ParametrosService } from '../../services/parametros.service';


@Component({
  selector: 'app-parametros',
  standalone: true,
  imports: [CalendarModule, PanelModule, CardModule, AccordionModule, SelectButtonModule, FormsModule, InputTextModule, CheckboxModule, RadioButtonModule, InputNumberModule, CommonModule, DropdownModule, ButtonModule, DialogModule, ListboxModule],
  templateUrl: './parametros.component.html',
  styleUrl: './parametros.component.css'
})

export class ParametrosComponent implements OnInit {
  constructor(
    private parametrosService: ParametrosService
  ) { }
  value!: number;
  weekDays!: any[]
  diasDeLiberacao: any[] = [];

  value1: number = 20;

  value2: number = 50;

  value3: number = 10;

  value4: number = 20;
  ngOnInit() {
    this.parametrosService.listaParametros().subscribe({
      next: (result) => {
        const parametros = result.result;
        for (let i = 0; i < parametros.length; i++) {
          const element = parametros[i];
          element.hora = new Date(element.hora);
          if (element.selected == 1) {
            element.selected = true;
            this.diasDeLiberacao.push(element.value);
          }else{
            element.selected = false;
          }
        }
        this.weekDays = parametros;
        console.log(result.result)
      },
      error: (error) => {
        console.log(error)
      }
    })
  }
  print(event: any) {
    this.diasDeLiberacao = event.value;
    this.weekDays.forEach(day => {
      day.selected = this.diasDeLiberacao.includes(day.value);
    });
    console.log(this.weekDays)
    this.parametrosService.insereParametro(this.weekDays).subscribe({
      next: (result) => {},
      error: (error) => {
        console.log(error)
      }
    })
  }
}
