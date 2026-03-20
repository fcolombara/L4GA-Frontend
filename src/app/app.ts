import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>` // Limpiamos el cartel azul
})
export class App {  // <--- REVISÁ QUE DIGA "export class App"
  title = 'L4GA-Frontend';
}
