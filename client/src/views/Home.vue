<template>
  <div class="home">
    <h1>Login</h1>
    <form>
      <v-text-field
        v-model="username"
        :error-messages="usernameErrors"
        :counter="15"
        label="Username"
        required
        @input="$v.username.$touch()"
        @blur="$v.username.$touch()"
      ></v-text-field>
      <v-text-field
        v-model="password"
        :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
        :type="showPassword ? 'text' : 'password'"
        :error-messages="passwordErrors"
        :counter="30"
        label="Password"
        required
        @input="$v.password.$touch()"
        @blur="$v.password.$touch()"
        @click:append="showPassword = !showPassword"
      ></v-text-field>

      <v-btn class="mr-4" @click="submit" dark>submit</v-btn>
      <v-btn @click="clear">clear</v-btn>
    </form>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate';
import { required, maxLength, minLength } from 'vuelidate/lib/validators';
import store from '../store';

export default {
  name: 'Home',
  mixins: [validationMixin],
  validations: {
    username: { required, maxLength: maxLength(15), minLength: minLength(3) },
    password: { required, maxLength: maxLength(30), minLength: minLength(6) },
  },
  data: () => ({
    username: '',
    password: '',
    showPassword: false,
  }),
  methods: {
    submit() {
      // this.$v.$touch();
      store.dispatch('user/login', {
        username: this.username,
        password: this.password,
      });
    },
    clear() {
      this.$v.$reset();
      this.username = '';
      this.password = '';
    },
  },
  computed: {
    usernameErrors() {
      const errors = [];
      if (!this.$v.username.$dirty) return errors;
      if (!this.$v.username.minLength) errors.push('Username must be at least 3 characters long');
      if (!this.$v.username.maxLength) errors.push('Username must be at most 15 characters long');
      if (!this.$v.username.required) errors.push('Username is required.');
      return errors;
    },
    passwordErrors() {
      const errors = [];
      if (!this.$v.password.$dirty) return errors;
      if (!this.$v.password.minLength) errors.push('Password must be at least 6 characters long');
      if (!this.$v.password.maxLength) errors.push('Password must be at most 30 characters long');
      if (!this.$v.password.required) errors.push('Password is required');
      return errors;
    },
  },
};
</script>

<style scoped>
.home {
  min-width: 400px;
  width: 50%;
  margin: 100px auto 0;
}
</style>
