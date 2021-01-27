import { Component, OnInit } from '@angular/core';
import { GlobalService } from './shared/global.service';
import { Usuario } from './shared/usuario';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'pedidos';

  constructor(public global: GlobalService) { }

  ngOnInit(){
    let aux = localStorage.getItem("PEDIDOS_LOGIN");
    if (aux){
      this.global.usuarioLogueado = JSON.parse(aux);
    }
  }

  salir(){
    localStorage.removeItem("PEDIDOS_LOGIN");
    this.global.usuarioLogueado = new Usuario();
  }

}
