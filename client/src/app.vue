<template>
  <div>
    <header style="display: flex; justify-content: center; padding: 1rem; color: #eeeeee; font-size: 1.5rem;">Wristshots</header>
    <button id="newpost" class="button" @click="toggleForm">New Post</button>
    <div class="contain">
      <form class="form1" enctype="multipart/form-data" @submit.prevent="upload" v-show="section === 1">
        <div style="margin-left: 1.7rem; margin-top: 0.2rem;">
          <croppa
            v-model="myCroppa"
            :width="380"
            :height="370"
            :placeholder-color="'#dddddd'"
            :remove-button-size="20"
            :disable-rotation="true"
            ></croppa>
        </div>
        <div style="margin-top: 0.9rem; margin-bottom: 0.4rem;">
          <input class="input1" type="text" name="" id="" placeholder="Enter caption" v-model="caption" required>
        </div>
        <button class="button" type="submit" @click.prevent="generateBlob">Upload</button>
        <span v-show="alert">{{alert}}</span>
      </form>
      <div class="list" style="display: flex; flex-wrap: wrap;">
        <div class="card" v-for="post in posts" :key="post._id" @click="modal(post)">
          <div>
            <img class="image" :src="post.imageUrl">
          </div>
          <div class="postcaption">
            {{post.caption}}
          </div>
        </div>
      </div>
      <div id="deleteconfirm" class="modal" v-if="section === 2">
        <div class="modalcontent" v-html="selected"></div>
        <div style="width: 12rem; margin: 0 auto; display: flex; justify-content: space-around;">
          <button class="button button2" @click="closeModal" v-if="showDelete"><span style="color: #a52812">Delete</span></button>
          <button class="button button2" @click="closeModal">Close</button>
        </div>
      </div>
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
      selected: null,
      showDelete: false,
      myCroppa: {},
    };
  },
  methods: {
    toggleForm() {
      this.section = (this.section + 1) % 2
    },
    generateBlob() {
      this.alert = "loading"

      this.myCroppa.generateBlob(
        blob => {
          // write code to upload the cropped image file (a file is a blob)
          let formData = new FormData()
          formData.append('caption', this.caption);
          formData.append('file', blob)

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
              this.alert = "";
              this.section = 0;
            })
        },
        'image/jpeg',
        0.9 // 90% compressed jpeg file
      );
    },
    modal(ob) {
      this.showDelete = false;
      if(localStorage.getItem('myPosts')) {
        if(localStorage.getItem('myPosts').includes(ob.imageUrl)){
          console.log('user authorized')
          this.showDelete = true;
        } else {
          console.log('user not authorized')
        }
      }
      this.section = 2;
      this.selected = `
        <div class="card-lg">
          <div><img class="image-lg" src="${ob.imageUrl}"></div>
          <div class="postcaption postcaption-lg">${ob.caption}</div>
        </div>
      `
    },
    closeModal() {
      this.section = 0;
      this.selected = null;
    }
  },
  mounted() {
    ax.get('/')
      .then(({data}) => {
        this.posts = data
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

  #newpost {
    position: fixed;
    top: 1rem;
    right: 1rem;
  }

  input {
    border: none;
  }

  .contain {
    margin-left: 2rem;
    margin-right: 2rem;
  }

  .button {
    cursor: pointer;
    padding: 0.5rem 1rem;
    color: #333;
    border: none;
    border-radius: 0.2rem;
  }

  .button2 {
    max-width: 5rem;
    margin: 1rem auto;
  }

  .button:hover {
    background-color: #fff;
  }

  .button:focus {
    box-shadow: 0 0 0.5rem 0 #4b80c5;
  }

  .form1 {
    position: fixed;
    width: 460px;
    left: 0;
    right: 0;
    margin: 1.25rem auto 0 auto;
    padding: 1.25rem 1rem;
    background-color: #1e2529da;
    border-radius: 0.3rem;
    text-align: center;
  }

  .input1 {
    padding: 0.4rem 0.5rem;
    margin-bottom: 0.8rem;
    width: 90%;
    box-sizing: border-box;
    color: white;
    background-color: #00000000;
    transition: background-color 0.3s;
    border-bottom: 1px solid #c4c4c4;
  }
  .input1:focus {
    background-color: #c4c4c4;
    color: black;
  }
  .input1:focus::placeholder {
    color: #ffffff;
  }

  .card {
    cursor: pointer;
    width: 230px;
    margin: 0.5rem;
    border: 4px solid transparent;
    border-radius: 0.4rem;
    box-shadow: 0 0 0.8rem #262626;
  }
  .card:hover {
    border-color: #c4c4c4;
  }
  .card-lg {
    border: 4px solid #c4c4c4;
    border-radius: 0.4rem;
    box-shadow: 0 0 0.8rem #181818;
    width: 660px;
    margin: 0;
  }
  .image {
    display: block;
    width: 100%;
    margin: 0;
    border-radius: 0.2rem;
  }
  .image-lg {
    display: block;
    width: 100%;
    margin: 0;
  }
  .postcaption {
    padding: 0.6rem 0.4rem 0.8rem 0.4rem;
    font-size: 0.9rem;
    background: none;
  }
  .postcaption-lg {
    font-size: 1.05rem;
  }

  .modal {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    padding-bottom: 2rem;
    display: flex;
    justify-content: center;
    align-content: center;
    flex-direction: column;
    z-index: 7;
    background-color: #222222c5;
  }

  .modalcontent {
    text-align: center;
    min-width: 19rem;
    margin: auto;
    padding: 0;
  }

  .modalcontent > p {
    margin-bottom: 0.6rem;
  }
</style>