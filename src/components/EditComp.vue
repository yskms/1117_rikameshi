<script>
  import firebaseApp from "../plugins/firebaseConfig"
  import { getFirestore, getDocs, collection } from "firebase/firestore"

  const db = getFirestore(firebaseApp)

export default {
  name: 'EditComp',
  props: ['detailObj'],
  data(){
    return{
      // datasArrJson2:[],
      // isShow:false,
      name:'',
      pay:[0,1,2,3,],
      payNow:[],
      genre:[0,1,2,3,4,],
      genreNow:[],
      map:{},
      // rootMemo:[{value:''},{value:''},{value:''},{value:''},{value:''}],
      rootMemo:[],
      // rootMemoNow:[],
      menu:[],
      // fav:0,
      payMethods:['現金','Paypay','d払い','クレカ',],
      genreArr:['ラーメン','肉','定食系','カレー','その他',],
      isRegist:false,
    }
  },
  mounted(){//こいつの実行は親のマウント時だわこれ！
    // this.fetchUsersAll()
        console.log('edit mounted')
        // console.log(this.detailObj.menu[0].img)
        // setTimeout(()=>{
        // this.isShow = true
        // console.log(this.datasArrJson)
        // console.log(this.detailObj.menu[0].img)
        // },1000)
        if(this.detailObj){
          this.copyData()
        }else{
          this.isRegist = true
          this.formatData()
        }
  },
  methods:{
    copyData(){
      this.name = this.detailObj.name
      // this.pay = this.detailObj.pay.concat()
      this.payNow = this.detailObj.pay.concat()
      this.genreNow = this.detailObj.genre.concat()
      // Object.assign(this.map, this.detailObj.map)
      this.rootMemo = this.detailObj.rootMemo.concat()
      this.menu = this.detailObj.menu.concat()
    },
    formatData(){
      this.name = ""
      this.payNow = []
      this.genreNow = []
      this.rootMemo = [{value:'',score:0},{value:'',score:0},{value:'',score:0},{value:'',score:0},{value:'',score:0}]
      this.menu = [{menuName:'',price:null,memo:'',img:''},{menuName:'',price:null,memo:'',img:''},{menuName:'',price:null,memo:'',img:''}]
    },
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
  }
}
</script>

<template>
  <div class="detail_home_cont">
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
          <h3><input v-model="name" placeholder=" 店名"></h3>
          <div class="detail_head_pay">
              <div v-for="(p,index) in pay" :key="index">
                <input type="checkbox" :id="p" v-model="payNow" :value="p">{{payMethods[p]}}
              </div>
          </div>
          <div class="detail_head_genre">
              <div v-for="(p,index) in genre" :key="index">
                <input type="checkbox" :id="p" v-model="genreNow" :value="p">{{genreArr[p]}}
              </div>
          </div>

        </div>
        <div class="detail_map">
          <img src="#" alt="">
        </div>
        <div class="detail_memo">
          <div class="detail_memo_ttl">
            <p>ポイント</p>
          </div>
          <div class="detail_memo_li_wrap">
            <li class="detail_memo_li" v-for="(r,index) in rootMemo" :key="index">
              <input v-model="r.value" placeholder=' "提供が早い"等'>
            </li>
          </div>
        </div>
        <div class="detail_menu">

          <div class="detail_menu_li" v-for="(m,index) in menu" :key="index">
            <div class="detail_menu_img">
              <!-- <img :src="this.detailObj.menu[0].img" alt=""> -->
              <!-- <img :src="gs://rikameshi.appspot.com/andrew-butler-aUu8tZFNgfM-unsplash.jpg" alt=""> -->
            </div>
            <div class="detail_menu_memo">
              <div><input type="text" v-model="m.menuName" placeholder="料理名"></div>
              <p><input type="text" v-model="m.memo" placeholder="おすすめポイント"></p>
            </div>
            <div class="detail_menu_price">
              <input type="number" v-model="m.price" placeholder="税込"> 円</div>
          </div>
        </div>

        <div class="detail_refresh" v-show="!isRegist">
          <div><button class="detail_refresh_btn">更新する</button></div>
        </div>
        <div class="detail_refresh" v-show="isRegist">
          <div><button class="detail_refresh_btn">登録する</button></div>
        </div>

        <!-- <div class="detail_react">
          <div><button>うまい</button></div>
          <div><button>イマイチ</button></div>
        </div>
        <div class="detail_edit">
          <div>情報修正</div>
        </div> -->

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
.detail_head input{
  border: 1px solid grey;
  border-radius: 5px;
  /* text-align: center; */
}
.detail_head_pay{
  display: flex;
}
.detail_head_genre{
  display: flex;
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
.detail_memo_li input{
  border: 1px solid grey;
  border-radius: 5px;
  margin: 1px;
}
/* --------------------------- */
.detail_menu{
  width: 100%;
}
.detail_menu_li{
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  /* background-color: aqua; */
  border: 1px solid grey;
  border-radius: 10px;
  height: 3.5em;
  padding: 5px;
  margin: 5px 0;
}
.detail_menu_img{
  height: 100%;
  width: 20%;
  background-color: rgb(0, 50, 23);
}
.detail_menu_img img{
  height: 100%;
  /* width: 10%; */
  object-fit: scale-down;
}
.detail_menu_memo{
  width: 60%;
}
.detail_menu_memo div input{
  width: 90%;
  border: 1px solid grey;
  border-radius: 5px;
}
.detail_menu_memo p input{
  font-size: 0.8em;
  width: 90%;
  border: 1px solid grey;
  border-radius: 5px;
}
.detail_menu_price{
  width: 20%;
}
.detail_menu_price input{
  width: 80%;
  border: 1px solid grey;
  border-radius: 5px;
}
/* --------------------------- */
.detail_refresh{
  display: flex;
  margin: 10px;
}
.detail_refresh_btn{
  padding: 1em;
  border-radius: 10px;
  border: 1px solid grey;
  border-radius: 5px;
}
/* --------------------------- */
/* .detail_edit{
  margin: 5px;
  background-color: aliceblue;
  
} */
/* --------------------------- */
/* --------------------------- */
</style>