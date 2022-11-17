<script>
// @ is an alias to /src
import DetailComp from '@/components/DetailComp.vue'

  import firebaseApp from "../plugins/firebaseConfig"
  import { getFirestore, getDocs, collection } from "firebase/firestore"
  import { getStorage, } from "firebase/storage"


  const db = getFirestore(firebaseApp)
  const firestorage = getStorage(firebaseApp)



export default {
  name: 'HomeView',
  components: {
    DetailComp
  },
  data(){
    return{
      datasArr:[],
      datasArrJson:[],
      isDetail:false,
      payMethods:['現金','Paypay','d払い','クレカ',],
      genreArr:['ラーメン','肉','定食系','カレー','その他',],
    }
  },
  mounted(){
    this.fetchUsersAll()
  },
  methods:{
    async fetchUsersAll(){  //全てのdatasデータ取得
        const querySnapshot = await getDocs(collection(db, "datas"));
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
          this.datasArr.push(doc.data())
          console.log(this.datasArr)
          console.log(this.datasArr[0])
          console.log(this.datasArr[0].name)
        });
          this.datasArrJson =  JSON.parse(JSON.stringify(this.datasArr)).concat()
          console.log(firestorage)

    },
    closeDetail(){
      this.isDetail = false
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
    <div class="detail_comp" v-show="isDetail">
      <DetailComp :datasArr="datasArr" :datasArrJson="datasArrJson" @close="closeDetail()"/>
    </div>
    <!-- ------------------------>
    
    <!-- 全画面表示のもの ここまで-------------------------------------------------------->
    <div class="home_main">
      <div class="home_head">
        <span>リカレ</span>
        <div>+++</div>
      </div>
      <div class="home_tag">
        <div class="home_tag_theme">
          <button>ランキング</button>
          <button>ランダム5</button>
        </div>
        <div class="home_tag_genre">
          <button>ラーメン</button>
        </div>
      </div>

      <div class="home_list_main">
        <div class="home_list_wrap" @click="isDetail=!isDetail">
          <div class="home_list_img_wrap">
            <img src="@/assets/ramen.jpeg" alt="">
            <img src="@/assets/ramen.jpeg" alt="">
            <img src="@/assets/ramen.jpeg" alt="">
          </div>
          <div class="home_list_ttl_wrap">
            <div class="home_list_ttl">
              {{datasArrJson[0].name}}
            </div>
            <div class="home_list_pay_wrap">
              <div class="home_list_pay" v-for="d in datasArrJson[0].pay" :key="d">
                {{payMethods[d]}}
              </div>
            </div>
            <div class="home_list_genre_wrap">
              <div class="home_list_genre" v-for="d in datasArrJson[0].genre" :key="d">
                {{genreArr[d]}},
              </div>
            </div>
          </div>
        </div>


        <div class="home_list_wrap">
          <div class="home_list_img_wrap">
            <img src="@/assets/ramen.jpeg" alt="">
            <img src="@/assets/ramen.jpeg" alt="">
            <img src="@/assets/ramen.jpeg" alt="">
          </div>
          <div class="home_list_ttl_wrap">
            <div class="home_list_ttl">
              抱きしめたい
            </div>
            <div class="home_list_pay_wrap">
              <div class="home_list_pay">
                現金
              </div>
              <div class="home_list_pay">
                paypay
              </div>
            </div>
            <div class="home_list_genre">
                ラーメン
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