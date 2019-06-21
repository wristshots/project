<template>
  <div>
    <header style="display: flex; justify-content: center; padding: 1rem; color: #eeeeee; font-size: 1.5rem;">Wristshots</header>
    <button @click="section = 1">New Post</button>
    <div class="contain">
      <form enctype="multipart/form-data" @submit.prevent="upload" v-show="section === 1">
        <input type="file" name="file" id="fileinput" @change="fileSelect"><br>
        <input type="text" name="" id="" placeholder="Enter caption" v-model="caption">
        <button type="submit">Upload</button><br>
        <span v-show="alert">{{alert}}</span>
      </form>
    </div>
  </div>
</template>

<script>
const ax = axios.create({
  baseURL: 'http://localhost:3000/',
});

export default {
  data() {
    return {
      alert: '',
      section: 0,
      file: null,
      caption: '',
      posts: [],
    };
  },
  methods: {
    fileSelect(event) {
      this.file = event.target.files[0]
    },
    upload() {
      this.alert = "loading"
      let formData = new FormData()
      formData.append('caption', this.caption);
      formData.append('file', this.file)

      ax.post('/', formData, {})
        .then(({data}) => {
          console.log(data)
          if(localStorage.getItem('myPosts')) {
            let newArr = JSON.parse(localStorage.getItem('myPosts'))
            newArr.push(data.imageUrl)
            localStorage.setItem('myPosts', JSON.stringify(newArr))
          } else {
            let arr = [data.imageUrl]
            localStorage.setItem('myPosts', JSON.stringify(arr))
          }
          this.posts.push(data)
        })
        .catch(err => console.log(err))
        .finally(() => {
          this.alert = ""
          document.getElementById('fileinput').value = ''
        })
    },
  },
  mounted() {
    ax.get('/')
      .then(({data}) => {
        console.log(data)
      })
      .catch(err => console.log(err))
  }
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
  color: white;
}

input {
  border: none;
}

.contain {
  border: 1px solid white;
  margin-left: 2rem;
  margin-right: 2rem;
}
</style>