<script>
  import EditComp from '@/components/EditComp.vue'
  import firebaseApp from "../plugins/firebaseConfig"
  import { getFirestore, getDocs, collection } from "firebase/firestore"

  const db = getFirestore(firebaseApp)

export default {
  name: 'DetailComp',
  props: ['detailObj',],
  components: {
    EditComp
  },
  data(){
    return{
      // datasArrJson2:[],
      // isShow:false,
      isEdit:false,
      payMethods:['現金','Paypay','d払い','クレカ',],
      genreArr:['ラーメン','肉','定食系','カレー','その他',],
    }
  },
  mounted(){
    // this.fetchUsersAll()
    console.log('detail mounted')
        // console.log(this.datasArrJson)
        // console.log(this.detailObj.menu[0].img)
        // setTimeout(()=>{
        // this.isShow = true
        // console.log(this.datasArrJson)
        // console.log(this.detailObj.menu[0].img)
        // },1000)
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
    },
    closeEdit(){
      this.isEdit = false
    },
    openEdit(){
      this.isEdit = true
    }
  }
}
</script>

<template>
  <div class="detail_home_cont">
    <!-- 全画面表示のもの -------------------------------------------------------->
    <div class="edit_comp" v-if="isEdit">
      <EditComp :detailObj="detailObj" @close="closeEdit()"/>
    </div>
    <!-- ------------------------>
    <div class="detail_cont">
      <div class="detail_main">

        <div class="detail_head">
          <div class="batsu" @click="closeWindow()">X</div>
          <h3>{{ this.detailObj.name }}</h3>
          <div><span v-for="d in detailObj.pay" :key="d">{{ payMethods[d] }},</span></div>
          <div><span v-for="d in detailObj.pay" :key="d">{{ genreArr[d] }},</span></div>
        
        </div>
        <div class="detail_map">
          <img src="#" alt="">
        </div>
        <div class="detail_memo">
          <div class="detail_memo_ttl">
            <p>ポイント</p>
          </div>
          <div  class="detail_memo_li_wrap">
            <li class="detail_memo_li" v-for="d in detailObj.rootMemo" :key="d.name">
              {{d.value}}
            </li>
          </div>
        </div>
        <div class="detail_menu">
          <div class="detail_menu_li">
            <div class="detail_menu_img">
              <img :src="this.detailObj.menu[0].img" alt="">
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
          <div @click="openEdit()">情報修正</div>
        </div>
      </div>
    </div>
    <!-- 全画面表示のもの ここまで-------------------------------------------------------->
    <!-- ------------------------>
  </div>
</template>

<style scoped>
.detail_home_cont{
  height: 100vh;
  width: 100vw;
  background-color: rgba(255, 255, 0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}
/* -------------------------------------------- */
.detail_cont{
  height: 90%;
  width: 90%;
  background-color: rgba(255, 255, 255, 0.5);
  /* z-index: 5; */
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
  height: 5em;
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
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
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
.detail_react button{
  border: 1px solid grey;
  border-radius: 5px;
}
/* --------------------------- */
.detail_edit{
  margin: 5px;
  background-color: aliceblue;
  
}
/* --------------------------- */
/* --------------------------- */
</style>