<script>
  import firebaseApp from "../plugins/firebaseConfig"
  import { getFirestore, getDocs, collection, setDoc, doc, addDoc, Timestamp } from "firebase/firestore"
  import { getStorage, ref, uploadBytesResumable, getDownloadURL, } from "firebase/storage"


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
  const firestorage = getStorage(firebaseApp)


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
      isRegist:false,//編集か新規登録かのフラグ

      thumbnail:['','',''],//画像情報たくさんのオブジェクト
      img_url:['','',''], //画像描画用にローカルのURL or FirestorageのURLを入れる

      markerLatLng2: {},
      // option2: { name: "2" },
    }
  },
  mounted(){
        console.log('edit mounted')
        console.log(this.detailObj)
        // console.log(this.detailObj.id)
        if(this.detailObj){ //detailObjを受け取っていれば編集モード
          this.copyData()
          this.mapUpdate()
        }else{
          this.isRegist = true  //じゃないなら新規作成だよ
          this.formatData()
          this.mapUpdate()
        }
        
  },
  methods:{
    copyData(){ //編集モードなので、元のデータを引用します
      this.name = this.detailObj.name
      // this.pay = this.detailObj.pay.concat()
      this.payNow = this.detailObj.pay.concat()
      this.genreNow = this.detailObj.genre.concat()
      // Object.assign(this.map, this.detailObj.map)
      this.rootMemo = this.detailObj.rootMemo.concat()
      this.menu = this.detailObj.menu.concat()
      for(let i=0;i<3;i++){
        this.img_url[i]=this.menu[i].img
      }
      console.log(this.detailObj.map)
      console.log(JSON.parse(JSON.stringify(this.detailObj.map)))
      this.markerLatLng2.lat = JSON.parse(JSON.stringify(this.detailObj.map)).latitude
      this.markerLatLng2.lng = JSON.parse(JSON.stringify(this.detailObj.map)).longitude
      console.log(this.markerLatLng2)
    },
    formatData(){ //新規作成なので、念のためデータをリセットします
      this.name = ""
      this.payNow = [0,]
      this.genreNow = []
      this.rootMemo = [{value:'',score:0},{value:'',score:0},{value:'',score:0},{value:'',score:0},{value:'',score:0}]
      this.menu = [{menuName:'',price:null,memo:'',img:''},{menuName:'',price:null,memo:'',img:''},{menuName:'',price:null,memo:'',img:''}]
      this.markerLatLng2 = {lat:null,lng:null}
    },
    mapUpdate(){
      const map2 = L.map("detail_map2", {
        center: L.latLng(34.6882035,135.492256),
        // attribution:'© <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        zoom: 16,
        // options:"option2"
      })
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, '}).addTo(map2)
      // .addLayer(L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"))
      let addMarker2 = L.marker(this.markerLatLng2).addTo(map2)
      map2.on("click", p => {
        if(addMarker2){map2.removeLayer(addMarker2)}
        // this.markerLatLng2 = p.latlng
        // map.addLayer(L.marker(p.latlng))
        this.markerLatLng2 = p.latlng
        addMarker2 = L.marker(this.markerLatLng2).addTo(map2)
        console.log(addMarker2)
        console.log(JSON.parse(JSON.stringify(this.markerLatLng2)))
      })
      // .on("click", this.selectGeo)
      // .addLayer(L.marker(this.markerLatLng2))
      console.log(map2)
    },
    // ---------これここでは使ってませんね---------------------
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
    // ---------これここでは使ってませんね---------------------

    closeWindow(){
      this.$emit('close')
    },

    imgUpload(event, index) {
      console.log(event)
      console.log(index)
      this.thumbnail[index] = event.target.files[0]
      console.log(this.thumbnail[index])
      this.img_url[index] = URL.createObjectURL(this.thumbnail[index])
      this.img_url.splice()//配列を変更しないけど変更して、Vueに反応させてます

      const storageRef = ref(firestorage, `files/${this.thumbnail[index].name}`)
      uploadBytesResumable(storageRef, this.thumbnail[index])
        .then((snapshot) => {
          getDownloadURL(snapshot.ref)
            .then((url) => {
              console.log('Success! : ' + url)
              this.img_url[index] = url
            })
        }).catch((error) => {
          console.error(error)
        })
    },
  
    run(){
      console.log(this.name)
      console.log(this.payNow)
      console.log(this.genreNow)
      console.log(this.rootMemo)
      console.log(this.menu)
      this.updateFiredatas()},
    //firestoreをアップデートするメソッド
    async updateFiredatas(){

      //画像URLをimg_urlで処理していたので、menuに反映させておきます
      for(let i=0;i<3;i++){
        this.menu[i].img = this.img_url[i]
      }

      //datas内の既存のuidに対して、上書き保存します
      await setDoc(doc(db, "datas", this.detailObj.id), 
      { name: this.name,
        pay: this.payNow,
        genre: this.genreNow,
        rootMemo: JSON.parse(JSON.stringify(this.rootMemo)),
        menu: JSON.parse(JSON.stringify(this.menu)),
        map: {latitude: this.markerLatLng2.lat, longitude: this.markerLatLng2.lng}
        },
      { merge: true }
      );
      console.log('update data!')
      this.$emit('reload', this.detailObj.id)
      console.log('update parent data!')
      this.closeWindow()
    },
    //firestoreに新規登録するメソッド
    async createFiredatas(){
      //画像URLをimg_urlで処理していたので、menuに反映させておきます
      for(let i=0;i<3;i++){
        this.menu[i].img = this.img_url[i]
      }
      //datas内の既存のuidに対して、上書き保存します
      const docRef = await addDoc(collection(db, "datas"),{ 
        name: this.name,
        pay: this.payNow,
        genre: this.genreNow,
        rootMemo: JSON.parse(JSON.stringify(this.rootMemo)),
        menu: JSON.parse(JSON.stringify(this.menu)),
        map: {latitude: this.markerLatLng2.lat, longitude: this.markerLatLng2.lng},
        date: Timestamp.fromDate(new Date()),
        
        },
      );
      console.log('create data!')
      console.log(docRef.id)
      this.$emit('reload', docRef.id)
      // console.log('update parent data!')
      this.closeWindow()
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
        <!-- leaflet ------------------------------------- -->
        <div id="detail_map2">
        </div>
        <!-- leaflet ------------------------------------- -->
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
              <!-- ここ追加してる -->
              <input type="file" :id="'img'+ index" accept="img/*" @change="imgUpload($event, index)"
              style="display:none">
              <label :for="'img'+ index">
                <div  v-if="!img_url[index]" >
                  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-card-image" viewBox="0 0 16 16">
                    <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                    <path d="M1.5 2A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13zm13 1a.5.5 0 0 1 .5.5v6l-3.775-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12v.54A.505.505 0 0 1 1 12.5v-9a.5.5 0 0 1 .5-.5h13z"/>
                  </svg>
                </div>
                <div class="imgfile" v-else >
                    <img :src="img_url[index]" />
                </div>
              </label>
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
          <div><button class="detail_refresh_btn" @click="run()">更新する</button></div>
        </div>
        <div class="detail_refresh" v-show="isRegist">
          <div><button class="detail_refresh_btn" @click="createFiredatas">新規登録する</button></div>
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
  align-items: center;
}
.detail_head_genre{
  display: flex;
}
/* --------------------------- */
#detail_map2{
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
  /* background-color: rgb(0, 50, 23); */
}
.imgfile{
  height: 100%;
}
.imgfile img{
  height: 100%;
  width: 100%;
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
.imgView{
  
}
/* --------------------------- */
</style>