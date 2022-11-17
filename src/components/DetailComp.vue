<script>
  import firebaseApp from "../plugins/firebaseConfig"
  import { getFirestore, getDocs, collection } from "firebase/firestore"

  const db = getFirestore(firebaseApp)

export default {
  name: 'DetailComp',
  props: ['datasArr','datasArrJson'],
  data(){
    return{
      // datasArrJson2:[],
      isShow:false,
    }
  },
  mounted(){
    // this.fetchUsersAll()
        console.log(this.datasArrJson)
        // console.log(this.datasArrJson[0].menu[0].img)
        setTimeout(()=>{
        // this.datasArrJson2 =  JSON.parse(JSON.stringify(this.datasArr)).concat()
        this.isShow = true
        console.log(this.datasArrJson)
        console.log(this.datasArrJson[0].menu[0].img)
        },1000)
  },
  methods:{
    async fetchUsersAll(){  //全てのdatasデータ取得
        const querySnapshot = await getDocs(collection(db, "datas"));
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
          // this.datasArr.push(doc.data())
          console.log(this.datasArr)
          console.log(this.datasArr[0])
          console.log(this.datasArr[0].name)
        });
    },
    closeWindow(){
      this.$emit('close')
    }
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
    <div class="detail_cont">
      <div class="detail_main">

        <div class="detail_head">
          <div class="batsu" @click="closeWindow()">X</div>
          <h3 v-if="isShow">{{ this.datasArrJson[0].name }}</h3>
        </div>
        <div class="detail_map">
          <img src="#" alt="">
        </div>
        <div class="detail_memo">
          <div class="detail_memo_ttl">ポイント</div>
          <div v-if="isShow" class="detail_memo_li_wrap">
            <li class="detail_memo_li" v-for="d in datasArrJson[0].rootMemo" :key="d.name">
              {{d}}
            </li>
          </div>
        </div>
        <div class="detail_menu">
          <div class="detail_menu_li" v-if="isShow">
            <div class="detail_menu_img">
              <img :src="this.datasArrJson[0].menu[0].img" alt="">
              <!-- <img :src="gs://rikameshi.appspot.com/andrew-butler-aUu8tZFNgfM-unsplash.jpg" alt=""> -->
            </div>
            <div>ラーメン</div>
            <div>900円</div>
          </div>
          <div class="detail_menu_li">
            <div class="detail_menu_img">
              <img src="@/assets/ramen.jpeg" alt="">
            </div>
            <div>ラーメン</div>
            <div>900円</div>
          </div>
          <div class="detail_menu_li">
            <div class="detail_menu_img">
              <img src="@/assets/ramen.jpeg" alt="">
            </div>
            <div>ラーメン</div>
            <div>900円</div>
          </div>
        </div>
        <div class="detail_react">
          <div><button>うまい</button></div>
          <div><button>イマイチ</button></div>
        </div>
        <div class="detail_edit">
          <div>情報修正</div>
        </div>
      </div>
    </div>
    <!-- 全画面表示のもの ここまで-------------------------------------------------------->
    <!-- ------------------------>
  </div>
</template>

<style scoped>
.home_cont{
  height: 100vh;
  width: 100vw;
  background-color: rgba(255, 255, 0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
/* -------------------------------------------- */
.detail_cont{
  height: 90%;
  width: 90%;
  background-color: rgba(255, 255, 255, 0.5);
}
.detail_main{
  display: flex;
  flex-direction: column;
  /* justify-content: center; */
  align-items: center;
  background-color: whitesmoke;
  width: 90%;
  margin: auto;
}
/* -------------------------------------------- */
.detail_head{
  position: relative;
  width: 100%;
  height: 1.6em;
}
.batsu{
  position: absolute;
  top: 0;
  right: 0;
  cursor: pointer;
}
/* --------------------------- */
.detail_map{
  width: 100%;
  height: 30vh;
  background-color: rgb(0, 0, 136);
}
/* --------------------------- */
.detail_memo{
  display: flex;
  width: 100%;
  /* padding: 5px; */
  background-color: gainsboro;
  border-radius: 10px;
  margin-top: 5px;
}
.detail_memo_ttl{
  width: 30%;
  height: 1em;
  margin: auto;
}
.detail_memo_li_wrap{
  width: 70%;
  text-align: left;
}
/* --------------------------- */
.detail_menu{
  width: 100%;
}
.detail_menu_li{
  display: flex;
  justify-content: space-around;
  width: 100%;
  /* background-color: aqua; */
  border: 1px solid grey;
  border-radius: 10px;
  height: 3.5em;
  padding: 2px;
  margin: 5px 0;
}
.detail_menu_img img{
  height: 100%;
  /* width: 10%; */
  object-fit: scale-down;
}
/* --------------------------- */
.detail_react{
  display: flex;
  margin: 10px;
}
/* --------------------------- */
.detail_edit{
  margin: 5px;
  background-color: aliceblue;
  
}
/* --------------------------- */
/* --------------------------- */
</style>