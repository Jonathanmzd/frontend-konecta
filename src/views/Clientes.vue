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
          <h6 class="text-center m-2"><b>Agregar nuevo Cliente</b></h6>
          <input
            type="number"
            placeholder="Documento"
            class="form-control my-2"
            v-model="item.documento"
          />
          <input
            type="text"
            placeholder="Nombre"
            class="form-control my-2"
            v-model="item.nombre"
          />
          <input
            type="email"
            placeholder="Correo"
            class="form-control my-2"
            v-model="item.correo"
          />
          <input
            type="text"
            placeholder="Direccion"
            class="form-control my-2"
            v-model="item.direccion"
          />
          <div class="mb-5">
            <b-button class="btn-sm btn-dark btn-block" type="submit"
              >Agregar</b-button
            >
          </div>
        </form>

        <form @submit.prevent="editaritem(itemEditar)" v-else>
          <h6 class="text-center m-2"><b>Editar Cliente</b></h6>
          <input
            type="number"
            placeholder="Documento"
            class="form-control my-2"
            v-model="itemEditar.documento"
          />
          <input
            type="text"
            placeholder="Nombre"
            class="form-control my-2"
            v-model="itemEditar.nombre"
          />
          <input
            type="email"
            placeholder="Correo"
            class="form-control my-2"
            v-model="itemEditar.correo"
          />
          <input
            type="text"
            placeholder="Direccion"
            class="form-control my-2"
            v-model="itemEditar.direccion"
          />
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
              <option value="documento">Documento</option>
              <option value="nombre">Nombre</option>
              <option value="correo">Correo</option>
              <option value="direccion">Direccion</option>
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
              <th scope="col">Documento</th>
              <th scope="col">Nombre</th>
              <th scope="col">Correo</th>
              <th scope="col">Direccion</th>
              <th scope="col">Accion</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in items" :key="index">
              <th scope="row">{{ item.id }}</th>
              <td>{{ item.documento }}</td>
              <td>{{ item.nombre }}</td>
              <td>{{ item.correo }}</td>
              <td>{{ item.direccion }}</td>
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
        .get(`/clientes/search/${campo}/${value}`)
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
        .get("/clientes")
        .then((res) => {
          // console.log(response.cliente)
          this.items = res.data.cliente;
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
        .post("/clientes", item, config)
        .then((res) => {
          // Agrega al inicio de nuestro array items
          this.items.unshift(res.data.cliente);
          this.item.documento = "";
          this.item.nombre = "";
          this.item.correo = "";
          this.item.direccion = "";

          // Alerta de mensaje
          this.showAlert();
          this.mensaje.texto = "Cliente Agregado!";
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
        .delete(`clientes/${id}`, config)
        .then((res) => {
          let index = this.items.findIndex((item) => item.id === res.data.id);
          this.items.splice(index, 1);

          this.showAlert();
          this.mensaje.texto = "Cliente Eliminado!";
          this.mensaje.color = "danger";
        })
        .catch((e) => {
          console.log(e.response);
        });
    },
    activarEdicion(id) {
      this.agregar = false;
      this.axios
        .get(`/clientes/${id}`)
        .then((res) => {
          this.itemEditar = res.data.cliente; // res.data es donde viene toda la informacion
          // console.log(res.data.cliente);
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
        .put(`/clientes/${item.id}`, item, config)
        .then((res) => {
          const index = this.items.findIndex(
            (itemcliente) => itemcliente.id === this.itemEditar.id
          );
          this.items[index].documento = this.itemEditar.documento;
          this.items[index].nombre = this.itemEditar.nombre;
          this.items[index].correo = this.itemEditar.correo;
          this.items[index].direccion = this.itemEditar.direccion;
          this.itemEditar = {};
          // Alerta de mensaje
          this.showAlert();
          this.mensaje.texto = "Cliente Actualizado!";
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
/* hide the blue outline */
.form-control:focus {
  outline: 0 !important;
  border-color: initial;
  box-shadow: none;
}
</style>