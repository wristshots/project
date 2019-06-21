<template>
  <div>
    <header style="display: flex; justify-content: center; padding: 1rem; color: #eeeeee; font-size: 1.5rem;">Wristshots</header>
    <button id="newpost" class="button" @click="toggleForm">New Post</button>
    <div class="contain">
      <form class="form1" enctype="multipart/form-data" v-show="section === 1">
        <!-- Croppa -->
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
        <button class="button" type="submit" @click.prevent="validateBlob">Validate</button><br>
        <!-- Progress Bar -->
        <div id="progressbarcontainer" style="width: 460px; height: 1.2rem; margin: 1rem 0; background-color: #3b3f44; border-radius: 0.4rem;" v-show="isWatch.message">
          <div id="progressbar"
            style="height: 1.2rem; margin: 0; background-color: #3599e0; border-radius: 0.4rem;"
            :style="{width: barWidth}"></div>
        </div>
        <!-- Message -->
        <div style="margin-bottom: 1rem; text-align: center;" v-show="isWatch.message"><span style="font-size: 0.9rem;">
          {{isWatch.message}}
        </span></div>
        <button class="button" type="submit" @click.prevent="generateBlob" v-show="isWatch.watch">Upload</button>
        <p style="padding: 0.2rem;" v-show="alert">{{alert}}</p>
      </form>
      <!-- List of posts -->
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
      <!-- Modal -->
      <div class="modal" v-if="section === 2">
        <div class="modalcontent" v-html="selected"></div>
        <div style="width: 12rem; margin: 0 auto; display: flex; justify-content: space-around;">
          <button class="button button2" @click="deletePost" v-if="showDelete"><span style="color: #a52812">Delete</span></button>
          <button class="button button2" @click="closeModal">Close</button>
        </div>
        <div style="width: 11.6rem; margin: 0 auto; display: flex; justify-content: space-around;">
          <!-- Sharingbutton Facebook -->
          <a class="resp-sharing-button__link" :href="hrefFacebok" target="_blank" rel="noopener" aria-label="">
            <div class="resp-sharing-button resp-sharing-button--facebook resp-sharing-button--small"><div aria-hidden="true" class="resp-sharing-button__icon resp-sharing-button__icon--solid">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z"/></svg>
              </div>
            </div>
          </a>

          <!-- Sharingbutton Twitter -->
          <a class="resp-sharing-button__link" :href="hrefTwitter" target="_blank" rel="noopener" aria-label="">
            <div class="resp-sharing-button resp-sharing-button--twitter resp-sharing-button--small"><div aria-hidden="true" class="resp-sharing-button__icon resp-sharing-button__icon--solid">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M23.44 4.83c-.8.37-1.5.38-2.22.02.93-.56.98-.96 1.32-2.02-.88.52-1.86.9-2.9 1.1-.82-.88-2-1.43-3.3-1.43-2.5 0-4.55 2.04-4.55 4.54 0 .36.03.7.1 1.04-3.77-.2-7.12-2-9.36-4.75-.4.67-.6 1.45-.6 2.3 0 1.56.8 2.95 2 3.77-.74-.03-1.44-.23-2.05-.57v.06c0 2.2 1.56 4.03 3.64 4.44-.67.2-1.37.2-2.06.08.58 1.8 2.26 3.12 4.25 3.16C5.78 18.1 3.37 18.74 1 18.46c2 1.3 4.4 2.04 6.97 2.04 8.35 0 12.92-6.92 12.92-12.93 0-.2 0-.4-.02-.6.9-.63 1.96-1.22 2.56-2.14z"/></svg>
              </div>
            </div>
          </a>
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
      selectedId: null,
      isWatch: {
        watch: false,
        score: 0,
        message: null,
      },
      showDelete: false,
      myCroppa: {},
      hrefFacebok: '',
      hrefTwitter: '',
    };
  },
  methods: {
    toggleForm() {
      this.section = (this.section + 1) % 2;
      this.myCroppa.remove();
      this.isWatch.watch = false;
      this.isWatch.score = 0;
      this.isWatch.message = null;
    },
    validateBlob() {
      this.alert = "Validating through Cloud Vision ..."

      this.myCroppa.generateBlob(
        blob => {
          let formData = new FormData()
          formData.append('file', blob)

          ax.post('/validate', formData, {})
            .then(({data}) => {
              this.isWatch.score = data.score
              if(+this.isWatch.score > 60) {
                this.isWatch.watch = true
              }
              this.isWatch.message = `${data.score}% probability that this is a watch.`
            })
            .catch(err => console.log(err))
            .finally(() => {
              this.alert = "";
            })
        },
        'image/jpeg',
        0.9 // 90% compressed jpeg file
      );
    },
    generateBlob() {
      this.alert = " Loading ..."

      this.myCroppa.generateBlob(
        blob => {
          // write code to upload the cropped image file (a file is a blob)
          let formData = new FormData()
          formData.append('caption', this.caption);
          formData.append('file', blob)

          ax.post('/', formData, {})
            .then(({data}) => {
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
              this.caption = '';
              this.myCroppa.remove();
              this.isWatch.watch = false;
              this.isWatch.score = 0;
              this.isWatch.message = null;
            })
        },
        'image/jpeg',
        0.9 // 90% compressed jpeg file
      );
    },
    deletePost() {
      ax.delete(`${this.selectedId}`)
        .catch(err => console.log(err))
        .finally(() => {
          this.section = 0;
          this.selected = null;
          ax.get('/')
            .then(({data}) => {
              this.posts = data
            })
            .catch(err => console.log(err))
        })
    },
    modal(ob) {
      this.selectedId = ob._id;
      this.showDelete = false;
      this.hrefFacebok = `https://facebook.com/sharer/sharer.php?u=${ob.imageUrl}`
      this.hrefTwitter = `https://twitter.com/intent/tweet/?text=Wristshots&amp;url=${ob.imageUrl}`
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
  },
  computed: {
    barWidth() {
      let num = this.isWatch.score * (460/100)
      return String(num) + 'px'
    }
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