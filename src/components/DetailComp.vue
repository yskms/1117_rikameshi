<script>
  import EditComp from '@/components/EditComp.vue'
  import firebaseApp from "../plugins/firebaseConfig"
  import { getFirestore, getDocs, collection, getDoc, doc, setDoc, } from "firebase/firestore"

import 'leaflet/dist/leaflet.css'
import L from "leaflet";
import { Icon } from 'leaflet';

delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

  const db = getFirestore(firebaseApp)

export default {
  name: 'DetailComp',
  props: ['detailObjP',],
  components: {
    EditComp, 
    // LMap, LTileLayer, LMarker,
  },
  data(){
    return{
      // datasArrJson2:[],
      // isShow:false,
      isEdit:false,
      payMethods:['現金','Paypay','d払い','クレカ',],
      genreArr:['','ラーメン','肉','定食系','カレー','カフェ','お弁当','その他',],

      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      // url: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
      attribution:'© <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      zoom: 16,
      center: [34.6882035,135.492256],
      markerLatLng: {lat:JSON.parse(JSON.stringify(this.detailObjP.map)).latitude,
                      lng:JSON.parse(JSON.stringify(this.detailObjP.map)).longitude},
      // option1: { name: "1" },//いらんかった

      detailObj:{},
      name : this.detailObjP.name,
      pay : this.detailObjP.pay,
      // payNow : this.detailObjP.pay,
      genre : this.detailObjP.genre,
      // Object.assign(this.map, this.detailObj.map)
      rootMemo : this.detailObjP.rootMemo,
      menu : this.detailObjP.menu,
      img_url:[],
  
      // isMapDel:false,
      isReview:false,
      isGood:true,
      isThanks:false,

      isBig:false,
      bigPhotoUrl:'',

    }
  },
  computed:{
    // detailObj(){
    //   return this.detailObj
    // }
  },
  mounted(){
    // this.fetchUsersAll()
    console.log('detail mounted')
    console.log(this.detailObjP)
        // console.log(this.datasArrJson)
        // console.log(this.detailObj.menu[0].img)

      this.dataSet()
      this.mapSet()
      this.outsideClick()
  
  },
  methods:{
    dataSet(){
      this.detailObj = {}
      Object.assign(this.detailObj,this.detailObjP)
    },
    mapSet(){
      const map = L.map("detail_map", {
        center: L.latLng(34.6882035,135.492256),
        // attribution:'© <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        zoom: 16,
        // options:"option1"
      })
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, '}).addTo(map)
      // .addLayer(L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"))
      let addMarker = L.marker(this.markerLatLng).addTo(map)
      console.log(addMarker)
      // if(this.isMapDel){
      //   this.isMapDel = false
      //   map.remove()
      // }
      // map.on("viewreset", p => {
      //   if(addMarker){map.removeLayer(addMarker)}
      //   // this.markerLatLng = p.latlng
      //   // map.addLayer(L.marker(p.latlng))
      //   this.markerLatLng = p.latlng
      //   addMarker = L.marker(this.markerLatLng).addTo(map)
      //   console.log(addMarker)
      //   console.log(this.markerLatLng)
      // })
      // .on("click", this.selectGeo)
      // .addLayer(L.marker(this.markerLatLng))
      console.log(map)
    },
    mapDel(){
      const map = L.map("detail_map", {}).remove()
      console.log(map)
    },
    selectGeo(p){
      console.log(p.latlng)
      this.markerLatLng = p.latlng
      console.log(this.markerLatLng)
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
    async fetchData(){
      const docRef = doc(db, "datas", this.detailObjP.id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        this.name = docSnap.data().name
      // this.pay = this.detailObj.pay.concat()
      this.pay = docSnap.data().pay.concat()
      this.genre = docSnap.data().genre.concat()
      // Object.assign(this.map, this.detailObj.map)
      this.rootMemo = docSnap.data().rootMemo.concat()
      this.menu = docSnap.data().menu.concat()
      this.markerLatLng.lat = JSON.parse(JSON.stringify(docSnap.data().map)).latitude
      this.markerLatLng.lng = JSON.parse(JSON.stringify(docSnap.data().map)).longitude
      console.log(this.markerLatLng)
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    },

    closeWindow(){
      // if(this.isEdit==false){
      this.$emit('close')
    },
    closeEdit(){
      this.isEdit = false
    },
    openEdit(){
      this.isEdit = true
    },
    outsideClick(){
      // if(this.isEdit==false){//なぜかこれは刺さりませんcloseWindowでやると刺さる。
        let modal = document.getElementById('detail_home_cont');
        modal.addEventListener('click', (event) => {
          if(this.isEdit==false){//ここに移動したら刺さった
            if(event.target.closest('#detail_cont, #edit_home_cont, #detail_map2, #review_cont, #big_photo_cont') === null) {
              // alert('外側をクリックされました。');
              console.log('outside click')
              this.closeWindow()
            }
          }
        })
      // }
    },
    outsideClickReview(tf){
        this.isGood = tf
        this.isReview = true
        console.log(this.isGood)
        let modal = document.getElementById('review_cont');
        modal.addEventListener('click', (event) => {
            if(event.target.closest('#review_main') === null) {
              console.log('outside click')
              this.isReview=false
            }
        })
    },
    outsideClickBigPhoto(url){
        this.bigPhotoUrl = url
        this.isBig = true
        let modal = document.getElementById('big_photo_cont');
        modal.addEventListener('click', (event) => {
              //書き換えるのが面倒なのでreview_mainにしてます。どこをクリックしてもbigPhoto閉じる挙動です
            if(event.target.closest('#review_main') === null) {
              console.log('outside click')
              this.isBig=false
            }
        })
    },
    bigPhoto(url){
      this.bigPhotoUrl = url
      this.isBig = true
      console.log(this.bigPhotoUrl)
    },

    //firestoreをアップデートするメソッド
    async updateFiredatas(number){
      //datas内の既存のuidに対して、上書き保存します
      this.isThanks = true
      console.log(this.isThanks)
      console.log(this.detailObjP.good )
      console.log(this.detailObjP.good + number)
      //detailObjPを使っているので更新をかけない限り追加評価できない！
      //実現したかった挙動になっているのでこのまま使います
      await setDoc(doc(db, "datas", this.detailObj.id), 
      { good: this.detailObjP.good + number,
        },
      { merge: true }
      );
      console.log('update data!')
      setTimeout(() => {
        this.isThanks = false
        this.isReview = false
      }, 1500);
    },
  }
}
</script>

<template>
  <div class="detail_home_cont" id="detail_home_cont">
    <!-- 全画面表示のもの -------------------------------------------------------->
    <div class="edit_comp" v-if="isEdit">
      <EditComp :detailObj="detailObj" @close="closeEdit()" @reload="$listeners['reload']"/>
    </div>
    <!-- ------------------------>
    <div class="review_cont" v-show="isReview" id="review_cont">
      <div class="review_main" id="review_main" v-if="isGood">
        <div class="review_thanks" v-show="isThanks">
          <p>Thank you for your vote!</p>
        </div>
        <p>Do you Like？</p>
        <div><button @click="updateFiredatas(1)">YES !!</button></div>
      </div>
      <div class="review_main" id="review_main" v-else-if="!isGood">
        <div class="review_thanks" v-show="isThanks">
          <p>Thank you for your vote!</p>
        </div>
        <p>Not Good？</p>
        <div><button @click="updateFiredatas(-2)">not good..</button></div>
      </div>
    </div>
    <!-- ------------------------>
    <div class="big_photo_cont" id="big_photo_cont" v-show="isBig">
      <div class="big_photo_main" id="big_photo_main">
        <img :src="bigPhotoUrl" alt="big_photo">
      </div>
    </div>
    <!-- 全画面表示のもの ここまで-------------------------------------------------------->
    <!-- ------------------------>
    <div class="detail_cont" id="detail_cont">
      <div class="detail_main" id="detail_main">

        <div class="detail_head">
          <div class="batsu" @click="closeWindow()">
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M13.854 2.146a.5.5 0 0 1 0 .708l-11 11a.5.5 0 0 1-.708-.708l11-11a.5.5 0 0 1 .708 0Z"/>
              <path fill-rule="evenodd" d="M2.146 2.146a.5.5 0 0 0 0 .708l11 11a.5.5 0 0 0 .708-.708l-11-11a.5.5 0 0 0-.708 0Z"/>
            </svg>
          </div>
          <h3>{{ this.name }}</h3>
          <div><span v-for="p in pay" :key="p">{{ payMethods[p] }},</span></div>
          <div><span v-for="g in genre" :key="g">{{ genreArr[g] }},</span></div>
        </div>

        <div class="detail_menu">
          <div class="detail_menu_li" v-for="(m,index) in menu" :key="index">
            <div class="detail_menu_img_wrap">
                <div  v-if="!m.img"  class="detail_menu_svg">
                      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-card-image" viewBox="0 0 16 16">
                        <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                        <path d="M1.5 2A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13zm13 1a.5.5 0 0 1 .5.5v6l-3.775-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12v.54A.505.505 0 0 1 1 12.5v-9a.5.5 0 0 1 .5-.5h13z"/>
                      </svg>
                </div>
                <div  v-else  class="detail_menu_img">
                  <img :src="m.img" alt="photo" @click="outsideClickBigPhoto(m.img)">
                </div>
            </div>
            <div class="detail_menu_name">
              <div>{{m.menuName}}</div>
              <p>{{m.memo}}</p>
            </div>
            <div class="detail_menu_price">
              <div>{{m.price}} 円</div>
            </div>
          </div>
        </div>

        <div class="detail_memo">
          <div class="detail_memo_ttl">
            <p>- おすすめポイント -</p>
          </div>
          <div  class="detail_memo_li_wrap">
            <li :class="{detail_memo_li:index%2==1}" v-for="(r,index) in rootMemo" :key="index">
              {{r.value}}
            </li>
          </div>
        </div>

        <div id="detail_map"  v-show="!isEdit"><!-------------------------->
          <!-- <div>{{ testdata }}</div> -->
          <!-- <l-map style="height: 100%" :zoom="zoom" :center="center">
            <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
            <l-marker :lat-lng="markerLatLng"></l-marker>
          </l-map> -->
          <!-- -------------------------------------->
        </div>


        <div class="detail_react">
          <div><button @click="outsideClickReview(true)">うまい</button></div>
          <div><button @click="outsideClickReview(false)">イマイチ</button></div>
        </div>
        <div class="detail_edit" @click="openEdit()">
          <div>情報修正</div>
        </div>
      </div>
    </div>
    <!-- 全画面表示のもの ここまで-------------------------------------------------------->
    <!-- ------------------------>
  </div>
</template>

<style scoped>
.detail_home_cont{
  max-width: 375px;
  margin: 0 auto;
  height: 100vh;
  width: 100vw;
  background-color: rgba(0, 0, 0,0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 3;
}
/* 全画面表示のもの------------------------------------------ */
/* -------------------------------------------- */
.review_cont{
  height: 100vh;
  width: 100vw;
  background-color: rgba(0, 0, 0, 0.5);
  /* display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center; */
  position: absolute;
  /* top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); */
  z-index: 2;
  /* padding: 1.5em; */
  /* font-size: 2em; */
}
.review_main{
  gap: 0.5em;
  height: 25%;
  width: 80%;
  background-color: rgba(255, 255, 0, 1);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 1.5em;
  font-size: 2em;
}
.review_thanks{
  height: 100%;
  width: 80%;
  background-color: rgba(255, 255, 0, 1);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 1.5em;
  font-size: 1.2em;
}
.review_main button{
  border: 1px solid;
  border-radius: 5px;
  padding: 0 10px;
  border-radius: 3px;
  box-shadow: -5px -5px 10px 0px rgba(255, 255, 255, 0.5), 5px 5px 10px 0px rgba(0, 0, 0, 0.3);
}
/* -------------------------------------------- */
.big_photo_cont{
  height: 100vh;
  width: 100vw;
  background-color: rgba(0, 0, 0, 0.8);
  position: absolute;
  z-index: 2;
}
.big_photo_main{
  height: 45%;
  width: 90%;
  /* background-color: rgba(255, 255, 0, 1); */
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  }
.big_photo_main img{
  height: 100%;
  width: 100%;
  object-fit: scale-down;
}

/* 全画面表示のもの ここまで------------------------------------------ */
/* -------------------------------------------- */
.detail_cont{
  height: 90%;
  width: 90%;
  /* background-color: rgba(255, 255, 255, 0.5); */
  background-color: white; 
  /* z-index: 5; */
  scroll-snap-type: y mandatory;
  overflow: auto;
  border-radius: 20px;
  box-shadow: 0px 0px 16px -6px rgba(0,0,0,0.6);
}
.detail_main{
  display: flex;
  flex-direction: column;
  /* justify-content: center; */
  align-items: center;
  background-color: white;
  width: 90%;
  margin: auto;
}
/* -------------------------------------------- */
.detail_head{
  position: relative;
  width: 100%;
  height: 10%;
  padding-top: 1em;
  padding-bottom: 0.5em;
}
.batsu{
  position: absolute;
  top: 12px;
  right: 0;
  cursor: pointer;
}
.detail_head h3{
  font-size: 1.5em;
  background: linear-gradient(transparent 50%, #ffff64 60%);
  padding: 0 10px 0 0;
  display: inline-block;
}
.detail_head span{
  font-size: 0.7em;
}
/* --------------------------- */
.detail_menu{
  width: 100%;
  margin-bottom: 0.5em;
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
.detail_menu_img_wrap{
  width: 20%;
  height: 100%;
}
.detail_menu_svg{
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.detail_menu_svg svg{
  height: 100%;
}
.detail_menu_img{
  height: 100%;
  width: 100%;
}
.detail_menu_img img{
  height: 100%;
  width: 100%;
  /* object-fit: scale-down; */
  object-fit: cover;
    object-position: center;
    border-radius: 10px;
}
.detail_menu_name{
  width: 60%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.detail_menu_name div{
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 0.9em;
  font-weight: bold;
}
.detail_menu_name p{
  font-size: 0.7em;
  text-align: center;
}
.detail_menu_price{
  width: 20%;
  display: flex;
  justify-content: center;
  align-items: center;
}
/* --------------------------- */
.detail_memo{
  /* display: flex; */
  width: 100%;
  /* padding: 5px; */
  background-color: white;
  /* border-radius: 10px; */
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}
.detail_memo_ttl{
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.6em;
  background-color: rgb(245, 245, 228);
}
.detail_memo_li_wrap{
  width: 100%;
  text-align: center;
  list-style: none;
  font-size: 0.9em;
}
.detail_memo_li_wrap li{
  /* padding: 2px 0; */
  margin: 2px 0;
}
.detail_memo_li{
  /* background-color: white; */
  background-color: rgb(245, 245, 228);
}

/* --------------------------- */
#detail_map{
  width: 100%;
  height: 30vh;
  background-color: rgb(0, 0, 136);
  z-index: 1;
  margin-bottom: 1em;
}

/* --------------------------- */
.detail_react{
  display: flex;
  margin: 10px;
}
.detail_react button{
  border: 1px solid grey;
  border-radius: 30px;
  margin: 0 20px;
  padding: 0 10px;
  font-size: 0.9em;
  /* font-weight: bold; */
  /* box-shadow: 0px 0px 16px -6px rgba(0,0,0,0.6) inset; */
  box-shadow: 0px 0px 11px -6px rgb(0 0 0 / 60%);
  /* background-color: white; */
}
/* --------------------------- */
.detail_edit{
  margin: 5px;
  /* background-color: aliceblue; */
  /* background-color: #5bacff; */
  border-bottom: 1px solid #5bacff;
  cursor: pointer;
  font-size: 0.7em;
  margin-bottom: 3em;
}
/* --------------------------- */
/* --------------------------- */
</style>