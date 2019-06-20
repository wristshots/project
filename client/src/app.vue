<template>
  <div>
    <h1>{{ message }}</h1>
    <input type="file" name="" id="">
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: 'Hello world',
    };
  },
};
</script>

<style>
* {
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  -webkit-touch-callout: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  &:focus {
    outline: none;
  }
}

html {
  height: 100%;
}

body {
  margin: 0;
  padding: 0;
  background-image: linear-gradient(180deg, #264661 0%, #0a243a 100%);
  background-repeat: no-repeat;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Noto Sans", "Ubuntu", "Helvetica Neue", "Cantarell", "Fira Sans", "Droid Sans", sans-serif;
}

input {
  border: none;
}
</style>