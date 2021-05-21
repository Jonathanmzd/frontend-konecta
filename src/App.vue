<template>
  <div id="app">
    <div class="container">
      <div>
        <b-navbar toggleable="md" type="dark" variant="dark">
          <b-navbar-brand href="#">Prueba Konecta</b-navbar-brand>

          <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

          <b-collapse id="nav-collapse" is-nav>
            <b-navbar-nav>
              <b-nav-item to="/">Home</b-nav-item>
              <b-nav-item to="/login"  v-if="!estaActivo">Login</b-nav-item>
              <b-nav-item to="/register"  v-if="!estaActivo">Registar</b-nav-item>
              <b-nav-item to="/usuarios" v-if="estaActivo">Usuarios</b-nav-item>
              <b-nav-item to="/clientes" v-if="estaActivo">Clientes</b-nav-item>
            </b-navbar-nav>

            <!-- Right aligned nav items -->
            <b-navbar-nav class="ml-auto">
              <b-nav-item-dropdown v-if="estaActivo">
                <template v-slot:button-content>
                  <em>Usuario</em>
                </template>
                <b-dropdown-item href="#">Perfil</b-dropdown-item>
                <b-dropdown-item @click="cerrarSesion()">Cerrar</b-dropdown-item>
              </b-nav-item-dropdown>
            </b-navbar-nav>
          </b-collapse>
        </b-navbar>
      </div>
      <router-view />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  methods: {
    ...mapActions(["cerrarSesion", "leerToken"]),
  },
  computed: {
    ...mapGetters(["estaActivo"]),
  },
  created() {
    this.leerToken();
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
