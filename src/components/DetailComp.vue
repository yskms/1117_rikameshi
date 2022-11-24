<script>
  import EditComp from '@/components/EditComp.vue'
  import firebaseApp from "../plugins/firebaseConfig"
  import { getFirestore, getDocs, collection, getDoc, doc, } from "firebase/firestore"

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

      isMapDel:false,

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
      if(this.isMapDel){
        this.isMapDel = false
        map.remove()
      }
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
      <EditComp :detailObj="detailObj" @close="closeEdit()" @reload="$listeners['reload']"/>
    </div>
    <!-- ------------------------>
    <div class="detail_cont">
      <div class="detail_main">

        <div class="detail_head">
          <div class="batsu" @click="closeWindow()">X</div>
          <h3>{{ this.name }}</h3>
          <div><span v-for="p in pay" :key="p">{{ payMethods[p] }},</span></div>
          <div><span v-for="g in genre" :key="g">{{ genreArr[g] }},</span></div>
        
        </div>
        <div id="detail_map"  v-show="!isEdit"><!-------------------------->
          <!-- <div>{{ testdata }}</div> -->
          <!-- <l-map style="height: 100%" :zoom="zoom" :center="center">
            <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
            <l-marker :lat-lng="markerLatLng"></l-marker>
          </l-map> -->
          <!-- -------------------------------------->

        </div>
        <div class="detail_memo">
          <div class="detail_memo_ttl">
            <p>ポイント</p>
          </div>
          <div  class="detail_memo_li_wrap">
            <li class="detail_memo_li" v-for="r in rootMemo" :key="r.name">
              {{r.value}}
            </li>
          </div>
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
                  <img :src="m.img" alt="">
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
        <div class="detail_react">
          <div><button @click="fetchData()">うまい</button></div>
          <div><button @click="mapDel()">イマイチ</button></div>
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
#detail_map{
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
  object-fit: scale-down;
}
.detail_menu_name{
  width: 60%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.detail_menu_name p{
  font-size: 0.8em;
  text-align: center;
}
.detail_menu_price{
  width: 20%;
  display: flex;
  justify-content: center;
  align-items: center;
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