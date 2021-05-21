<template>
  <div class="container">
    <h1>login</h1>
    <form @submit.prevent="login">
      <input
        type="email"
        placeholder="Email"
        class="form-control my-2"
        v-model="usuario.email"
      />
      <input
        type="password"
        placeholder="Password"
        class="form-control my-2"
        v-model="usuario.password"
      />
      <button type="submit" class="btn btn-dark btn-block">Acceder</button>
    </form>
    <div v-if="mensaje != ''">
      <p>{{ mensaje }}</p>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  data() {
    return {
      usuario: { email: "admin@gmail.com", password: "12345678" },
      mensaje: "",
    };
  },
  methods: {
    ...mapActions(['guardarUsuario']),
    login() {
      // console.log(this.usuario);
      this.axios
        .post("/login", this.usuario)
        .then((res) => {
          console.log(res.data);
          const token = res.data.token;
          this.guardarUsuario(token); 
          // this.$router.push({name:'notas'})
          this.$router.push({name:'clientes'})
        })
        .catch((e) => {
          console.log(e);
          // this.mensaje = e.response.data
        });
    },
  },
};
</script>

<style>
</style>