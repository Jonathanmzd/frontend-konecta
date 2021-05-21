<template>
  <div class="container">
    <h1>Registro</h1>
    <form @submit.prevent="registrar">
      <input
        type="text"
        placeholder="Nombre y Apellidos"
        class="form-control my-2"
        v-model="usuario.name"
      />
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
      <input
        type="password"
        placeholder="Nuevamente Password"
        class="form-control my-2"
        v-model="usuario.password_confirmation"
      />
      <button type="submit" class="btn btn-dark btn-block">Registrar</button>
    </form>
    <div v-if="mensaje != ''">
      <p>{{ mensaje }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      usuario: { name: "jonathan", email: "a@gmail.com", password: "12345678", password_confirmation: "12345678" },
      mensaje: "",
    };
  },
  methods: {
    registrar() {
      // console.log(this.usuario);
      this.axios
        .post("/register", this.usuario)
        .then((res) => {
          // Agrega usuario 
          console.log(res.data);
          this.usuario.name = "";
          this.usuario.email = "";
          this.usuario.password = "";
          this.usuario.password_confirmation = "";
          // Alerta de mensaje
          this.mensaje = res.data.message;
        })
        .catch((e) => {
          console.log(e.response.data);
          if (e.response.data.email) {
            this.mensaje = "El email ya ha sido registrado";
          }
          if (e.response.data.password) {
            this.mensaje = "La confirmación de la contraseña no coincide.";
          }
          
        });
    },
  },
};
</script>

<style>
</style>