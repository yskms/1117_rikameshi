<script>
// @ is an alias to /src
  import DetailComp from '@/components/DetailComp.vue'
  import EditComp from '@/components/EditComp.vue'

  import firebaseApp from "../plugins/firebaseConfig"
  import { getFirestore, getDocs, collection } from "firebase/firestore"
  import { getStorage, ref, uploadBytes, uploadBytesResumable, getDownloadURL, } from "firebase/storage"


  const db = getFirestore(firebaseApp)
  const firestorage = getStorage(firebaseApp)



export default {
  name: 'HomeView',
  components: {DetailComp, EditComp,},
  data(){
    return{
      datasArr:[],
      datasArrJson:[],
      isDetail:false,
      isEdit:false,
      payMethods:['現金','Paypay','d払い','クレカ',],
      genreArr:['ラーメン','肉','定食系','カレー','その他',],
      detailObj:{},

      img_url:'',
      thumbnail:'',
    }
  },
  mounted(){
    this.fetchDatasAll()
  },
  methods:{
    async fetchDatasAll(){  //全てのdatasデータ取得
        const querySnapshot = await getDocs(collection(db, "datas"));
        querySnapshot.forEach((docu) => {
          // doc.data() is never undefined for query doc snapshots
          console.log(docu.id, " => ", docu.data());
          const dataObj = Object.assign(docu.data(),{id:docu.id})
          console.log(dataObj)
          this.datasArr.push(dataObj)
          // this.datasArr.push(docu.data())
          console.log(this.datasArr)
          // console.log(this.datasArr[0])
          // console.log(this.datasArr[0].name)
        });
          this.datasArrJson =  JSON.parse(JSON.stringify(this.datasArr)).concat()
          console.log(firestorage)

    },
    closeComp(){
      this.isDetail = false
      this.isEdit = false
    },
    openDetail(id){
      this.searchDetailObj(id)
      console.log(this.detailObj)
      this.isDetail = true
    },
    searchDetailObj(id){
      this.datasArrJson.forEach(e=>{
        if(e.id==id){
          Object.assign(this.detailObj, e)
        }
      })
    },

    fileUpload(props) {
    //アップロードしたい画像の情報を取得。
    const file = props.target.files[0];
    //画像ファイルのURLを取得。
    this.img_url = URL.createObjectURL(file);
    //"files"は③で作成したフォルダ名
    //Firebase storageに画像ファイルを送信。
    const storageRef = ref(firestorage, "files/" + file.name);

    //Firebaseにデータを適切に送るために必要なコード
    uploadBytes(storageRef, file).then((snapshot) => {
      console.log("blobかfileをアップロード", snapshot);
    });
  },

  changeImg(e) {
      this.thumbnail = e.target.files[0]
      console.log(this.thumbnail)
    this.img_url = URL.createObjectURL(this.thumbnail)

      const storageRef = ref(firestorage, `files/${this.thumbnail.name}`)
      uploadBytesResumable(storageRef, this.thumbnail)
        .then((snapshot) => {
          getDownloadURL(snapshot.ref)
            .then((url) => {
              console.log('Success! : ' + url)
            })
        }).catch((error) => {
          console.error(error)
        })
    },
  }
}
</script>

<template>
  <div class="home_cont">
    <!-- 全画面表示のもの -------------------------------------------------------->
    <!-- <div class="start">
      <div class="logo">
        リカレめし
      </div>
    </div> -->
    <!-- ------------------------>
    <div class="edit_comp" v-if="isEdit">
      <EditComp  @close="closeComp()"/>
    </div>
    <!-- ------------------------>
    <div class="detail_comp" v-if="isDetail">
      <DetailComp :datasArrJson="datasArrJson" :detailObj="detailObj" @close="closeComp()"/>
    </div>
    <!-- ------------------------>
    
    <!-- 全画面表示のもの ここまで-------------------------------------------------------->
    <div class="home_main">
      <div class="home_head">
        <span>リカレ</span>
        <div @click="isEdit=!isEdit">+++</div>
      </div>
      <div class="home_tag">
        <div class="home_tag_theme">
          <!-- <button>ランキング</button> -->
          <!-- <button>ランダム5</button> -->
        </div>
        <div class="home_tag_genre">
          <!-- <button>ラーメン</button> -->
          <!-- <input type="file" name="fa" id="fa"> -->
<input type="file" @change="fileUpload" />
<!-- アップロードされた画像が以下に表示される -->
  
    <input type="file" id="file" accept="img/*" @change="changeImg"
    style="display:none">
    <label for="file">
      <div  v-if="!img_url" >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-card-image" viewBox="0 0 16 16">
          <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
          <path d="M1.5 2A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13zm13 1a.5.5 0 0 1 .5.5v6l-3.775-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12v.54A.505.505 0 0 1 1 12.5v-9a.5.5 0 0 1 .5-.5h13z"/>
        </svg>
      </div>
      <div  v-if="img_url" >
          <img :src="img_url" />
      </div>
    </label>

        </div>
      </div>

      <div class="home_list_main">
        <div v-for="(data,index) in datasArrJson" :key="index"
        class="home_list_wrap" @click="openDetail(data.id)">
          <div class="home_list_img_wrap">
            <img src="@/assets/ramen.jpeg" alt="">
            <img src="@/assets/ramen.jpeg" alt="">
            <img src="@/assets/ramen.jpeg" alt="">
          </div>
          <div class="home_list_ttl_wrap">
            <div class="home_list_ttl">
              {{data.name}}
            </div>
            <div class="home_list_pay_wrap">
              <div class="home_list_pay" v-for="d in data.pay" :key="d">
                {{payMethods[d]}}
              </div>
            </div>
            <div class="home_list_genre_wrap">
              <div class="home_list_genre" v-for="d in data.genre" :key="d">
                {{genreArr[d]}},
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
    <!-- ------------------------>
  </div>
</template>

<style scoped>
.home_cont{
  height: 100vh;
  width: 100vw;
  background-color: yellow;
  display: flex;
  justify-content: center;
  align-items: center;
}
/* -------------------------------------------- */
.home_main{
  height: 95%;
  width: 90%;
  background-color: whitesmoke;
  scroll-snap-type: y mandatory;
  overflow: auto;
}
/* ----------------------------------- */
.home_head{
  height: 4%;
  background-color: yellowgreen;
  position: relative;
}
.home_head div{
  position: absolute;
  top: 0;
  right: 0;
}
/* ----------------------------------- */
.home_tag{
  height: 10%;
  text-align: left;
  background-color: yellow;
}
.home_tag button{
  border: 1px solid grey;
  border-radius: 5px;
  margin-top: 5px;
}
/* ----------------------------------- */
.home_list_wrap{
  display: flex;
  padding: 10px;
  margin-bottom: 5px;
  /* background-color: bisque; */
  border: solid 1px gray;
  border-radius: 10px;
  height: 15vh;
  width: 100%;
}
/* --------------------------- */
.home_list_img_wrap{
  height: 100%;
  width: 50%;
  scroll-snap-type: x mandatory;
  overflow: auto;
  display: flex;
  gap: 3px;
}
.home_list_img_wrap img{
  height: 100%;
  object-fit: scale-down;
  object-position: center center;
}
/* --------------------------- */
.home_list_ttl_wrap{
  width: 50%;
  height: 100%;
}
.home_list_ttl{
  height: 40%;
  font-size: 1.2em;
}
.home_list_pay_wrap{
  height: 30%;
  display: flex;
  justify-content: end;
  gap: 5px;
  font-size: 0.9em;
}
.home_list_genre_wrap{
  height: 30%;
  display: flex;
  justify-content: end;
  gap: 5px;
  font-size: 0.9em;
}
/* --------------------------- */
/* --------------------------- */
</style>