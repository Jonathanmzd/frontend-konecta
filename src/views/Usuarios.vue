<template>
  <div>
    <div class="row">
      <div class="col-md-4">
        <b-alert
          :show="dismissCountDown"
          dismissible
          :variant="mensaje.color"
          @dismissed="dismissCountDown = 0"
          @dismiss-count-down="countDownChanged"
        >
          {{ mensaje.texto }}
        </b-alert>

        <form @submit.prevent="agregarCliente(item)" v-if="agregar">
          <h6 class="text-center m-2"><b>Agregar nuevo Usuario</b></h6>
          <input
            type="text"
            placeholder="Nombre"
            class="form-control my-2"
            v-model="item.name"
          />
          <input
            type="email"
            placeholder="Email"
            class="form-control my-2"
            v-model="item.email"
          />
          <input
            type="text"
            placeholder="Rol"
            class="form-control my-2"
            v-model="item.id_rol"
          />
          <div class="mb-5">
            <b-button class="btn-sm btn-dark btn-block" type="submit"
              >Agregar</b-button
            >
          </div>
        </form>

        <form @submit.prevent="editaritem(itemEditar)" v-else>
          <h6 class="text-center m-2"><b>Editar Usuario</b></h6>
          <input
            type="text"
            placeholder="Nombre"
            class="form-control my-2"
            v-model="itemEditar.name"
          />
          <input
            type="text"
            placeholder="Nombre"
            class="form-control my-2"
            v-model="itemEditar.email"
          />
          <small for="Rol">Seleccionar Rol</small>
          <select class="form-control my-2" v-model="itemEditar.id_rol">
              <option value="" selected>{{itemEditar.id_rol}}</option>
              <option value=""></option>
              <option value="1">Administrador</option>
              <option value="2">Vendedor</option>
          </select>
          <b-button class="btn-sm btn-block mb-1 btn-warning" type="submit"
            >Editar</b-button
          >
          <b-button class="btn-sm btn-block" @click="agregar = true"
            >Cancelar</b-button
          >
        </form>
      </div>
      <div class="col-md-8">
        <form @submit.prevent="buscar(busca)">
          <div class="input-group mt-3 mb-3 row no-gutters">
            <select v-model="busca.campo">
              <option value="name">Nombre</option>
              <option value="email">Email</option>
              <option value="id_rol">Rol</option>
            </select>
            <input
              type="text"
              class="form-control border-left-0 rounded-0 rounded-right"
              aria-label="Text input with dropdown button"
              v-model="busca.value"
              placeholder="..."
            />
            <button class="btn btn-outline-dark border-left-0 rounded-0 rounded-right" type="button" @click="limpiar()">
              X
            </button>
            <button class="btn btn-outline-dark border-left-0 rounded-0 rounded-right" type="submit">Buscar</button>
          </div>
        </form>

        <table class="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Nombre</th>
              <th scope="col">Correo</th>
              <th scope="col">Rol</th>
              <th scope="col">Accion</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in items" :key="index">
              <th scope="row">{{ item.id }}</th>
              <td>{{ item.name }}</td>
              <td>{{ item.email }}</td>
              <td v-if="item.id_rol == 1">
                Administrador
              </td>
              <td v-if="item.id_rol == 2">
                Vendedor
              </td>
              <td>
                <b-button
                  class="btn-warning btn-sm mx-2"
                  @click="activarEdicion(item.id)"
                  >Actualizar</b-button
                >
                <b-button
                  class="btn-danger btn-sm mx-2"
                  @click="eliminaritem(item.id)"
                  >Eliminar</b-button
                >
              </td>
            </tr>
          </tbody>
        </table>
        
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      busca: {},
      items: [],
      item: {},
      agregar: true,
      mensaje: { color: "success", texto: "" },
      dismissSecs: 5,
      dismissCountDown: 0,

      //PUT
      itemEditar: {}, // retorna todo el objeto data a la vista
    };
  },
  computed: {
    ...mapState(["token"]),
  },
  created() {
    this.listaritems();
  },
  methods: {
    limpiar() {
      location.reload();
    },
    buscar(busca) {
      let campo = busca.campo;
      let value = busca.value;
      this.axios
        .get(`/usuarios/search/${campo}/${value}`)
        .then((res) => {
          console.log(res.data);
          this.items = res.data.filterData;
          this.totalitems = res.data.filterData.length;
        })
        .catch((e) => {
          console.log(e.response);
        });
    },
    listaritems() {
      this.axios
        .get("/usuarios")
        .then((res) => {
          // console.log(response.usuario)
          this.items = res.data.usuario;
        })
        .catch((e) => {
          console.log("error" + e);
        });
    },
    agregarCliente(item) {
      let config = {
        headers: {
          Authorization: "Bearer " + this.token,
        },
      };

      this.axios
        .post("/usuarios", item, config)
        .then((res) => {
          // Agrega al inicio de nuestro array items
          this.items.unshift(res.data.usuario);
          this.item.name = "";
          this.item.email = "";
          this.item.id_rol = "";

          // Alerta de mensaje
          this.showAlert();
          this.mensaje.texto = "Usuario Agregado!";
          this.mensaje.color = "success";
        })
        .catch((e) => {
          console.log(e.response.data);

          // Alerta de mensaje
          this.showAlert();
          this.mensaje.color = "danger";
          this.mensaje.texto = e.response.data;
        });
    },
    eliminaritem(id) {
      let config = {
        headers: {
          Authorization: "Bearer " + this.token,
        },
      };
      this.axios
        .delete(`usuarios/${id}`, config)
        .then((res) => {
          let index = this.items.findIndex((item) => item.id === res.data.id);
          this.items.splice(index, 1);

          this.showAlert();
          this.mensaje.texto = "Usuario Eliminado!";
          this.mensaje.color = "danger";
        })
        .catch((e) => {
          console.log(e.response);
        });
    },
    activarEdicion(id) {
      this.agregar = false;
      this.axios
        .get(`/usuarios/${id}`)
        .then((res) => {
          this.itemEditar = res.data.usuario; // res.data es donde viene toda la informacion
          // console.log(res.data.usuario);
        })
        .catch((e) => {
          console.log(e.response);
        });
    },
    editaritem(item) {
      let config = {
        headers: {
          Authorization: "Bearer " + this.token,
        },
      };
      this.axios
        .put(`/usuarios/${item.id}`, item, config)
        .then((res) => {
          const index = this.items.findIndex(
            (itemusuario) => itemusuario.id === this.itemEditar.id
          );
          this.items[index].name = this.itemEditar.name;
          this.items[index].email = this.itemEditar.email;
          this.items[index].id_rol = this.itemEditar.id_rol;
          this.itemEditar = {};

          // Alerta de mensaje
          this.showAlert();
          this.mensaje.texto = "Usuario Actualizado!";
          this.mensaje.color = "success";
        })
        .catch((e) => {
          console.log(e.response.data.errors);
          // // Alerta de mensaje
          this.showAlert();
          this.mensaje.color = "danger";
          this.mensaje.texto = e.response.data.errors;
        });
      this.agregar = false;
    },
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown;
    },
    showAlert() {
      this.dismissCountDown = this.dismissSecs;
    },
  },
};
</script>

<style scoped>
.form-control:focus {
  outline: 0 !important;
  border-color: initial;
  box-shadow: none;
}
</style>