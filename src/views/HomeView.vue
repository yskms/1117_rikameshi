<script>
// @ is an alias to /src
  import DetailComp from '@/components/DetailComp.vue'
  import EditComp from '@/components/EditComp.vue'

  import firebaseApp from "../plugins/firebaseConfig"
  import { getFirestore, getDocs, collection } from "firebase/firestore"
  // import { getStorage, } from "firebase/storage"


  const db = getFirestore(firebaseApp)
  // const firestorage = getStorage(firebaseApp)



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
      detailObjP:{},
    }
  },
  mounted(){
    console.log('home mounted')
    this.fetchDatasAll()
  },
  methods:{
    async fetchDatasAll(){  //全てのdatasデータ取得
        this.datasArr = []
        this.datasArrJson = []
        const querySnapshot = await getDocs(collection(db, "datas"));
        querySnapshot.forEach((docu) => {
          // doc.data() is never undefined for query doc snapshots
          console.log(docu.id, " => ", docu.data());
          const dataObj = Object.assign(docu.data(),{id:docu.id})
          console.log(dataObj)
          this.datasArr.push(dataObj)
          console.log(this.datasArr)
        });
        this.datasArrJson =  JSON.parse(JSON.stringify(this.datasArr)).concat()
        console.log(this.datasArrJson)
    },
    async reloadDetail(detailId){  //全てのdatasデータ取得
        this.closeComp()
        this.datasArr = []
        this.datasArrJson = []
        const querySnapshot = await getDocs(collection(db, "datas"));
        querySnapshot.forEach((docu) => {
          // doc.data() is never undefined for query doc snapshots
          console.log(docu.id, " => ", docu.data());
          const dataObj = Object.assign(docu.data(),{id:docu.id})
          console.log(dataObj)
          this.datasArr.push(dataObj)
          console.log(this.datasArr)
        });
        this.datasArrJson =  JSON.parse(JSON.stringify(this.datasArr)).concat()
        console.log(this.datasArrJson)
        console.log(detailId)
        this.openDetail(detailId)
    },
    closeComp(){
      this.isDetail = false
      this.isEdit = false
    },
    openDetail(id){
      this.searchDetailObj(id)
      console.log(this.detailObjP)
      this.isDetail = true
    },
    searchDetailObj(id){
      this.detailObjP = {}
      this.datasArrJson.forEach(e=>{
        if(e.id==id){
          Object.assign(this.detailObjP, e)
        }
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
      <EditComp  @close="closeComp()" @reload="reloadDetail"/>
    </div>
    <!-- ------------------------>
    <div class="detail_comp" v-if="isDetail">
      <DetailComp :datasArrJson="datasArrJson" :detailObjP="detailObjP" 
      @close="closeComp()" @reload="reloadDetail"/>
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
          <button>ランキング</button>
          <button>ランダム5</button>
        </div>
        <div class="home_tag_genre">
          <button>ラーメン</button>
        </div>
      </div>

      <div class="home_list_main">
        <div v-for="(data,index) in datasArrJson" :key="index"
        class="home_list_wrap" @click="openDetail(data.id)">

          <div class="home_list_img_wrap">
            <div class="home_list_img" v-for="(d,index) in data.menu" :key="index">
                <img :src="d.img" alt="">
            </div>
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
  display: flex;
  /* gap: 3px; */
  scroll-snap-type: x mandatory;
  overflow: auto;
}
.home_list_img{
  height: 90%;
  width: 100%;
  /* overflow: hidden; */
  /* scroll-snap-type: x mandatory; */
  /* overflow: auto; */
  /* object-fit: scale-down; */
}
.home_list_img img{
  height: 100%;
  /* width: 100%; */
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