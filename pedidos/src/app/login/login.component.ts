import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalService } from '../shared/global.service';
import { Usuario } from '../shared/usuario';
import { UsuarioService } from '../shared/usuario.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form = new FormGroup({});
  mensaje = "";

  constructor(private usuarioService: UsuarioService,
    private global: GlobalService,
    private formBuilder: FormBuilder) { }


  ngOnInit(): void {

    this.form = this.formBuilder.group({
      usuaLogin: ['', Validators.required],
      usuaPassword: ['', Validators.required]
    });
  }


  aceptar() {
    this.mensaje = "";
    if (!this.form.valid) {
      this.mensaje = "Por favor complete los datos";
      return;
    }

    let usuario = new Usuario();
    //Object.assign(usuario, this.form.value);
    usuario.usuaLogin = this.form.value.usuaLogin;
    usuario.usuaPassword = this.form.value.usuaPassword;

    this.usuarioService.post(usuario)
      .subscribe((data) => {
        if (data.usuaId > 0) {
          this.global.usuarioLogueado = data;
          localStorage.setItem("PEDIDOS_LOGIN",
            JSON.stringify(data));
        } else {
          this.mensaje = "Usuario o password Incorrecto";
        }
      });

  }

  cancelar() {
    // hace algo??
  }

}
