<script>
// @ is an alias to /src
  import DetailComp from '@/components/DetailComp.vue'
  import EditComp from '@/components/EditComp.vue'

  import firebaseApp from "../plugins/firebaseConfig"
  import { getFirestore, getDocs, collection, orderBy, query, } from "firebase/firestore"
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
      genreArrSort:['ALL','ラーメン','肉','定食系','カレー','カフェ','お弁当','その他',],
      genreArr:['','ラーメン','肉','定食系','カレー','カフェ','お弁当','その他',],
      detailObjP:{},
      sortArr:[],
      isSelected:[true,false,false,false,false,false,false,false,],
      isSelectedTheme:[false,false,false],//ランキング、ランダム、お気に入りを想定
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
        this.sortArr = []
        // const querySnapshot = await getDocs(collection(db, "datas"));
        const datasRef = collection(db, "datas")
        const que = query(datasRef, orderBy("date","desc"))
        const querySnapshot = await getDocs(que)
        //1行だと走らなかったよ
        // const querySnapshot = await getDocs(query(collection(db, "datas")), orderBy("genre","desc"))
        querySnapshot.forEach((docu) => {
          // doc.data() is never undefined for query doc snapshots
          console.log(docu.id, " => ", docu.data());
          const dataObj = Object.assign(docu.data(),{id:docu.id})
          console.log(dataObj)
          this.datasArr.push(dataObj)
          console.log(this.datasArr)
        });
        this.datasArrJson =  JSON.parse(JSON.stringify(this.datasArr)).concat()
        this.sortArr =  JSON.parse(JSON.stringify(this.datasArr)).concat()
        console.log(this.datasArrJson)
    },
    async reloadDetail(detailId){  //更新、登録時のリロード用。全てのdatasデータ取得
        this.closeComp()
        this.datasArr = []
        this.datasArrJson = []
        this.sortArr = []
        // const querySnapshot = await getDocs(collection(db, "datas"));
        const datasRef = collection(db, "datas")
        const que = query(datasRef, orderBy("date","desc"))
        const querySnapshot = await getDocs(que)
        //1行だと走らなかったよ
        // const querySnapshot = await getDocs(query(collection(db, "datas")), orderBy("genre","desc"))
        querySnapshot.forEach((docu) => {
          // doc.data() is never undefined for query doc snapshots
          console.log(docu.id, " => ", docu.data());
          const dataObj = Object.assign(docu.data(),{id:docu.id})
          console.log(dataObj)
          this.datasArr.push(dataObj)
          console.log(this.datasArr)
        });
        this.datasArrJson =  JSON.parse(JSON.stringify(this.datasArr)).concat()
        this.sortArr =  JSON.parse(JSON.stringify(this.datasArr)).concat()
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
    // sort---------------------
    sortGenre(number){
      this.isSelectedTheme = [false,false,false]
      this.isSelected = [false,false,false,false,false,false,false,false,]
      this.isSelected[number] = true
      this.sortArr = [],
      this.datasArrJson.forEach(e=>{
        for(let i=0;i<e.genre.length;i++){
          if(e.genre[i]==number){
            this.sortArr.push(e)
            break
          }
        }
      })
      console.log(this.sortArr)
    },
    sortRank(){
      this.isSelectedTheme = [true,false,false]
      this.isSelected = [false,false,false,false,false,false,false,false,]
      this.sortArr = this.datasArrJson.concat()
      this.sortArr.sort(function(a,b){
        if(a.good < b.good){
          return 1
        }else{
          return -1
        }
      })
      console.log(this.sortArr)
    },
    sortRandom(){
      this.isSelectedTheme = [false,true,false]
      this.isSelected = [false,false,false,false,false,false,false,false,]
      const datasArrJsonCopy = this.datasArrJson.concat()
      console.log(datasArrJsonCopy)
      this.sortArr = []
      // const testArr=[]
      for(let j=0,len=datasArrJsonCopy.length; j<5; j++,len--){
        const rand = Math.floor(Math.random()*len) //乱数
        console.log(`length: ${datasArrJsonCopy.length}`)
        console.log(rand)
        console.log(datasArrJsonCopy)
        this.sortArr.push(datasArrJsonCopy.splice(rand,1)[0])
        // testArr.push(datasArrJsonCopy.splice(rand,1)[0])
        console.log(this.sortArr)
        // console.log(testArr)
      }
      console.log(this.sortArr)
        // console.log(testArr)
    },
  }
}
</script>

<template>
<div class="bg">
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
        <div @click="isEdit=!isEdit" class="add_store">
          <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="#ffea00" class="bi bi-plus-circle-fill" viewBox="0 0 16 16">
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z"/>
          </svg>
        </div>
    
    <!-- 全画面表示のもの ここまで-------------------------------------------------------->
    <div class="home_main">
      <div class="home_head">
        <span>
          <svg width="199" height="30" viewBox="0 0 199 34" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.554 2.255C15.0193 2.54166 17.241 3.27266 19.219 4.448C21.197 5.62333 22.9313 7.2 24.422 9.178C24.766 9.608 25.0527 10.081 25.282 10.597C25.5113 11.113 25.7407 11.6147 25.97 12.102C26.6293 13.4207 26.9447 14.7967 26.916 16.23C26.8873 17.6347 26.8443 19.0107 26.787 20.358C26.7583 21.39 26.5147 22.379 26.056 23.325C25.626 24.271 25.153 25.1883 24.637 26.077C24.0063 27.1663 23.2897 28.227 22.487 29.259C21.8563 30.033 21.1397 30.6923 20.337 31.237C19.5343 31.753 18.6743 32.1687 17.757 32.484C17.0977 32.6847 16.4383 32.8997 15.779 33.129C15.1197 33.387 14.4173 33.5017 13.672 33.473L12.554 2.255ZM0.299 8.361C0.270333 8.07433 0.299 7.85933 0.385 7.716C0.499667 7.544 0.657334 7.40066 0.858001 7.286C0.657334 7.05667 0.471001 6.74133 0.299 6.34C0.127 5.91 0.198667 5.523 0.514001 5.179C0.6 5.03567 0.872334 4.93533 1.331 4.878C1.78967 4.82067 2.234 4.77767 2.664 4.749C3.094 4.72033 3.309 4.706 3.309 4.706H5.631C6.233 4.706 6.59133 4.792 6.706 4.964C6.84933 5.10733 6.94967 5.48 7.007 6.082C7.179 8.404 7.23633 10.726 7.179 13.048C7.15033 15.3413 7.16467 17.6347 7.222 19.928V21.648C6.964 21.6767 6.706 21.734 6.448 21.82C6.21867 21.906 5.98933 21.949 5.76 21.949C5.18667 21.9777 4.61333 21.992 4.04 21.992C3.46667 21.9633 2.89333 21.949 2.32 21.949C1.94733 21.949 1.68933 21.8917 1.546 21.777C1.40267 21.6337 1.25933 21.3757 1.116 21.003C0.915334 20.315 0.815001 19.627 0.815001 18.939C0.843667 18.2223 0.829334 17.52 0.772 16.832C0.686 15.9147 0.614334 14.9973 0.557001 14.08C0.528334 13.134 0.485334 12.188 0.428 11.242C0.399334 10.7547 0.385 10.2673 0.385 9.78C0.385 9.29267 0.356334 8.81967 0.299 8.361ZM41.321 6.34C41.6363 6.28267 41.9373 6.254 42.224 6.254C42.5107 6.254 42.783 6.254 43.041 6.254C44.0443 6.22533 45.0333 6.211 46.008 6.211C46.9827 6.211 47.9573 6.19667 48.932 6.168L49.018 0.534998C49.6487 0.534998 50.265 0.534998 50.867 0.534998C51.469 0.534998 52.0853 0.549332 52.716 0.578C53.2893 0.578 53.877 0.592333 54.479 0.620999C55.081 0.620999 55.6973 0.620999 56.328 0.620999C56.3567 1.02233 56.371 1.42367 56.371 1.825C56.371 2.22633 56.371 2.599 56.371 2.943C56.371 3.48767 56.3567 4.018 56.328 4.534C56.328 5.05 56.328 5.58033 56.328 6.125C57.5033 6.125 58.7073 6.15367 59.94 6.211C61.1727 6.23967 62.4197 6.28267 63.681 6.34V14.381C62.563 14.4957 61.4307 14.6103 60.284 14.725C59.1373 14.8397 58.0193 14.9543 56.93 15.069C56.8153 15.069 56.7007 15.0833 56.586 15.112C56.5 15.112 56.3997 15.112 56.285 15.112C56.2563 16.0293 56.242 16.961 56.242 17.907C56.242 18.853 56.2277 19.7847 56.199 20.702C56.1703 22.3073 56.113 23.9413 56.027 25.604C55.9697 27.2667 55.9123 28.958 55.855 30.678L49.104 30.549C49.0467 29.0297 48.975 27.5103 48.889 25.991C48.803 24.443 48.7313 22.9523 48.674 21.519C48.6453 20.1717 48.6453 18.9963 48.674 17.993C48.7027 16.9897 48.7313 16.488 48.76 16.488V15.069H41.321V6.34ZM72.066 5.695L71.808 14.725C71.808 14.725 71.7937 14.9973 71.765 15.542C71.765 16.058 71.7507 16.7317 71.722 17.563C71.722 18.3943 71.7077 19.2543 71.679 20.143C71.679 21.0317 71.6647 21.8487 71.636 22.594C71.636 23.3107 71.636 23.8267 71.636 24.142C71.6647 25.7473 71.636 27.3527 71.55 28.958C71.4927 30.5633 71.5213 32.14 71.636 33.688L63.853 33.559V33.43C63.7957 33.4873 63.767 33.516 63.767 33.516C63.3943 33.5447 63.036 33.5877 62.692 33.645C62.4053 33.6737 62.133 33.688 61.875 33.688C61.617 33.7167 61.3447 33.7167 61.058 33.688C60.542 33.6307 60.284 33.344 60.284 32.828C60.2553 31.452 60.2267 30.076 60.198 28.7C60.1693 27.324 60.1263 25.9337 60.069 24.529C60.1837 24.5003 60.284 24.4573 60.37 24.4C60.4847 24.3427 60.585 24.2997 60.671 24.271L60.628 24.314H63.896L63.939 5.738C64.111 5.68067 64.5267 5.66633 65.186 5.695C65.874 5.695 66.648 5.70933 67.508 5.738C68.3967 5.738 69.2567 5.738 70.088 5.738C70.9193 5.738 71.5787 5.72367 72.066 5.695ZM89.61 32.226C89.1513 32.226 88.8647 32.1687 88.75 32.054C88.6353 31.9107 88.578 31.5953 88.578 31.108C88.578 30.1047 88.5923 29.1013 88.621 28.098C88.6497 27.066 88.6353 26.0627 88.578 25.088V4.276C88.578 3.76 88.5637 3.244 88.535 2.728C88.535 2.212 88.6783 1.653 88.965 1.051C89.5383 1.051 90.1117 1.06533 90.685 1.094C91.287 1.12266 91.8747 1.137 92.448 1.137C92.9353 1.137 93.4083 1.137 93.867 1.137C94.3257 1.10833 94.7987 1.07966 95.286 1.051C95.7447 1.051 96.0313 1.10833 96.146 1.223C96.2893 1.309 96.361 1.58133 96.361 2.04C96.361 2.32667 96.3323 2.62766 96.275 2.943C96.2463 3.22967 96.2177 3.53067 96.189 3.846C96.189 3.98933 96.1747 4.16133 96.146 4.362C96.146 4.534 96.1603 4.69167 96.189 4.835C96.4183 6.41167 96.49 7.974 96.404 9.522C96.3467 11.0413 96.3323 12.5893 96.361 14.166C96.361 14.4813 96.361 14.811 96.361 15.155C96.361 15.4703 96.3753 15.7857 96.404 16.101L112.443 15.585C112.443 15.9003 112.429 16.23 112.4 16.574C112.4 16.8893 112.386 17.2047 112.357 17.52C112.099 20.1573 111.411 22.594 110.293 24.83C109.204 27.0373 107.426 28.872 104.961 30.334C104.732 30.4487 104.502 30.592 104.273 30.764C104.044 30.9073 103.814 31.0507 103.585 31.194C103.47 31.2513 103.341 31.323 103.198 31.409C103.083 31.4663 102.954 31.5237 102.811 31.581C102.352 31.6957 101.879 31.8103 101.392 31.925C100.905 32.011 100.417 32.097 99.93 32.183C99.414 32.2977 98.898 32.398 98.382 32.484C97.866 32.5413 97.3357 32.5557 96.791 32.527C96.6477 32.527 96.5043 32.484 96.361 32.398C96.2177 32.312 96.103 32.226 96.017 32.14C95.9883 32.3407 95.9167 32.4697 95.802 32.527C95.6873 32.5557 95.4723 32.5557 95.157 32.527C94.727 32.4697 94.2827 32.4267 93.824 32.398C93.394 32.3693 92.9783 32.3407 92.577 32.312C92.0897 32.2833 91.588 32.269 91.072 32.269C90.5847 32.269 90.0973 32.2547 89.61 32.226ZM125.214 18.208C125.357 17.0327 125.701 15.9433 126.246 14.94C126.819 13.908 127.536 12.962 128.396 12.102C129.055 11.4427 129.743 10.855 130.46 10.339C131.177 9.79433 131.936 9.307 132.739 8.877C132.653 8.56167 132.567 8.24633 132.481 7.931C132.395 7.61567 132.323 7.30033 132.266 6.985C132.094 6.23967 131.922 5.49433 131.75 4.749C131.578 4.00367 131.392 3.21533 131.191 2.384C132.108 2.126 132.997 1.85367 133.857 1.567C134.746 1.25167 135.649 1.12267 136.566 1.18C137.025 1.18 137.354 1.25167 137.555 1.395C137.756 1.53833 137.899 1.81067 137.985 2.212C138.157 2.986 138.315 3.76 138.458 4.534C138.63 5.308 138.802 6.082 138.974 6.856C139.433 6.856 139.877 6.87033 140.307 6.899C140.766 6.92767 141.21 6.99933 141.64 7.114C142.557 7.286 143.489 7.52967 144.435 7.845C145.381 8.16033 146.227 8.64767 146.972 9.307C147.115 8.67633 147.201 8.06 147.23 7.458C147.287 6.856 147.359 6.23967 147.445 5.609C147.502 4.97833 147.574 4.34766 147.66 3.717C147.746 3.05766 147.832 2.36966 147.918 1.653C148.749 1.71033 149.552 1.75333 150.326 1.782C151.1 1.782 151.845 1.93967 152.562 2.255C152.906 2.36967 153.135 2.513 153.25 2.685C153.365 2.857 153.393 3.115 153.336 3.459C153.107 5.20766 152.863 6.95633 152.605 8.705C152.347 10.425 152.089 12.1737 151.831 13.951C151.802 14.037 151.788 14.123 151.788 14.209C151.788 14.2663 151.774 14.3237 151.745 14.381C151.802 14.5817 151.788 14.768 151.702 14.94C151.645 15.112 151.473 15.2123 151.186 15.241C150.469 15.2697 149.882 15.5133 149.423 15.972C148.993 16.402 148.506 16.7603 147.961 17.047C146.814 17.5917 145.711 18.2367 144.65 18.982C143.618 19.6987 142.543 20.3867 141.425 21.046C141.396 21.0747 141.368 21.089 141.339 21.089C141.31 21.089 141.282 21.1033 141.253 21.132C141.339 21.5047 141.425 21.863 141.511 22.207C141.626 22.551 141.74 22.895 141.855 23.239C141.941 23.5257 141.998 23.8267 142.027 24.142C142.084 24.4573 142.013 24.744 141.812 25.002C141.583 25.088 141.368 25.174 141.167 25.26C140.995 25.346 140.823 25.4177 140.651 25.475C140.364 25.5897 140.063 25.7043 139.748 25.819C139.461 25.905 139.16 25.9767 138.845 26.034C138.243 26.1487 137.856 25.8907 137.684 25.26C137.598 24.9733 137.512 24.6867 137.426 24.4C137.34 24.0847 137.24 23.7837 137.125 23.497C135.548 24.3857 133.957 25.2743 132.352 26.163C130.775 27.0517 129.17 27.969 127.536 28.915C127.307 28.3703 127.106 27.8687 126.934 27.41C126.762 26.9513 126.561 26.5213 126.332 26.12C125.587 24.8587 125.171 23.5687 125.085 22.25C124.999 20.9027 125.042 19.5553 125.214 18.208ZM160.087 19.498V20.874C160.144 23.3967 159.571 25.5897 158.367 27.453C157.192 29.2877 155.672 30.9217 153.809 32.355C153.58 32.4983 153.336 32.656 153.078 32.828C152.849 32.9713 152.619 33.1147 152.39 33.258L145.123 20.745C146.728 19.7703 148.319 18.81 149.896 17.864C151.473 16.8893 153.049 15.9147 154.626 14.94C154.769 14.8827 154.927 14.8253 155.099 14.768C155.3 14.7107 155.472 14.639 155.615 14.553C155.844 14.4097 156.074 14.252 156.303 14.08C156.561 13.908 156.876 13.6787 157.249 13.392C157.306 13.4207 157.421 13.478 157.593 13.564C157.765 13.6213 157.908 13.7217 158.023 13.865C158.252 14.2377 158.467 14.639 158.668 15.069C158.869 15.4703 159.041 15.886 159.184 16.316C159.356 16.7173 159.499 17.1187 159.614 17.52C159.757 17.9213 159.901 18.3227 160.044 18.724C160.13 18.9533 160.144 19.2113 160.087 19.498ZM172.127 5.093C172.098 4.80633 172.141 4.59133 172.256 4.448C172.371 4.276 172.528 4.13267 172.729 4.018C172.528 3.76 172.328 3.43033 172.127 3.029C171.955 2.599 172.027 2.19767 172.342 1.825C172.457 1.71033 172.743 1.62433 173.202 1.567C173.661 1.481 174.105 1.42367 174.535 1.395C174.994 1.36633 175.223 1.352 175.223 1.352H177.588C178.219 1.352 178.591 1.438 178.706 1.61C178.849 1.75333 178.95 2.14033 179.007 2.771C179.208 5.12167 179.279 7.48666 179.222 9.866C179.165 12.2167 179.165 14.5817 179.222 16.961V18.681C178.935 18.7097 178.663 18.767 178.405 18.853C178.176 18.939 177.946 18.982 177.717 18.982C177.115 19.0107 176.527 19.025 175.954 19.025C175.381 18.9963 174.807 18.982 174.234 18.982C173.833 18.982 173.56 18.9247 173.417 18.81C173.274 18.6667 173.13 18.4087 172.987 18.036C172.786 17.3193 172.686 16.6027 172.686 15.886C172.686 15.1693 172.657 14.467 172.6 13.779C172.514 12.833 172.457 11.887 172.428 10.941C172.399 9.96633 172.356 8.99166 172.299 8.017C172.27 7.52966 172.242 7.04233 172.213 6.555C172.213 6.039 172.184 5.55167 172.127 5.093ZM177.803 29.861C177.488 29.4597 177.172 29.044 176.857 28.614C176.542 28.1553 176.255 27.6967 175.997 27.238C174.764 24.9447 174.234 22.551 174.406 20.057C174.435 19.7703 174.492 19.584 174.578 19.498C174.693 19.412 174.893 19.3547 175.18 19.326C175.581 19.326 175.983 19.326 176.384 19.326C176.814 19.2973 177.23 19.283 177.631 19.283C178.892 19.2257 180.154 19.1827 181.415 19.154C182.705 19.0967 183.995 19.0823 185.285 19.111C186.202 19.1397 187.12 19.0823 188.037 18.939C188.983 18.7957 189.929 18.7527 190.875 18.81C191.248 18.8387 191.62 18.8673 191.993 18.896C192.366 18.896 192.738 18.7957 193.111 18.595H193.928C193.928 17.391 193.928 16.2013 193.928 15.026C193.928 13.822 193.914 12.618 193.885 11.414C193.885 11.242 194.114 11.1847 194.573 11.242C195.06 11.2707 195.605 11.371 196.207 11.543C196.809 11.6863 197.311 11.8297 197.712 11.973C198.113 12.0877 198.242 12.1307 198.099 12.102C198.128 12.274 198.128 12.4603 198.099 12.661C198.07 12.833 198.07 13.005 198.099 13.177C198.07 14.1517 198.056 15.1263 198.056 16.101C198.056 17.047 198.056 18.0073 198.056 18.982C198.171 19.4407 198.185 19.9423 198.099 20.487C198.013 20.831 197.97 21.1893 197.97 21.562C197.97 21.906 197.956 22.2643 197.927 22.637C197.87 23.411 197.683 24.1277 197.368 24.787C197.139 25.3603 196.895 25.9337 196.637 26.507C196.408 27.0803 196.135 27.6393 195.82 28.184C195.189 29.1873 194.444 30.0473 193.584 30.764C192.753 31.4807 191.807 32.0827 190.746 32.57C189.341 33.2007 187.808 33.602 186.145 33.774C185.514 33.8313 184.869 33.8027 184.21 33.688C183.579 33.5733 182.949 33.387 182.318 33.129C181.458 32.7563 180.641 32.2977 179.867 31.753C179.122 31.2083 178.434 30.5777 177.803 29.861Z" fill="black"/>
          </svg>
        </span>
      </div>
      <div class="home_tag">
        <div class="home_tag_genre">
          <div v-for="(g,index) in genreArrSort" :key="index">
            <button @click="sortGenre(index)" :class="{selected:isSelected[index]}">{{g}}</button>
          </div>
        </div>
        <div class="home_tag_theme">
          <button @click="sortRank" :class="{selected:isSelectedTheme[0]}">ランキング</button>
          <button @click="sortRandom" :class="{selected:isSelectedTheme[1]}">ランダム5</button>
        </div>
      </div>

      <div class="home_list_main">
        <div v-for="(data,index) in sortArr" :key="index"
        class="home_list_wrap" @click="openDetail(data.id)">

          <div class="home_list_img_wrap">
            <div class="home_list_img" v-for="(d,index) in data.menu" :key="index">
                <img :src="d.img" alt="">
            </div>
          </div>

          <div class="home_list_ttl_wrap">
            <div class="home_list_ttl">
              <div>{{data.name}}</div>
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
</div>
</template>

<style scoped>
.bg{
  height: 100vh;
  width: 100vw;
  background-color: rgb(245, 245, 228);
}
.home_cont{
  max-width: 375px;
  margin: 0 auto;
  height: 100vh;
  width: 100vw;
  background-color: rgb(245, 245, 228);
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
/* -------------------------------------------- */
.home_main{
  height: 95%;
  width: 90%;
  background-color: rgb(245, 245, 228);
  scroll-snap-type: y mandatory;
  overflow: auto;
}
/* ----------------------------------- */
.home_head{
  height: 4%;
  background-color: #ffea00;
  position: relative;
  border-radius: 50px  0 50px 0;
}
.add_store{
  position: fixed;
  bottom: 10px;
  right: 10%;
  z-index: 1;
}
/* ----------------------------------- */
.home_tag{
  height: 10%;
  text-align: left;
  background-color: rgb(245, 245, 228);
  margin-top: 1em;
  margin-bottom: 1em;
}
.home_tag_genre{
  height: 50%;
  width: 100%;
  scroll-snap-type: x mandatory;
  overflow: auto;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.home_tag_theme{
  height: 50%;
  width: 100%;
}
.home_tag button{
  border: 1px solid grey;
  border-radius: 5px;
  margin-top: 5px;
  margin-right: 5px;
  padding: 0 0.5em;
  /* height: 50%; */
  width: max-content;
}
.selected{
  border-radius: 5px;
  background-color: #5bacff;
  /* background-color: #f5cfc8; */
}
/* ----------------------------------- */
.home_list_wrap{
  display: flex;
  padding: 10px;
  margin-bottom: 20px;
  background-color: white;
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
.home_list_ttl_wrap::before{
  content: "";
  position: absolute;
  left: -1em;
  top: 0;
  width: 1.1em;
  /* background-color: black; */
  background-image: linear-gradient(90deg,rgba(255,255,255,0.1) 50%,rgba(255,255,255,1) 100%);
  height: 100%;
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
  border-radius: 8px;
}
/* --------------------------- */
.home_list_ttl_wrap{
  width: 50%;
  height: 100%;
  padding: 0.5% 0 0.5% 1%;
  position: relative;
}
.home_list_ttl{
  height: 60%;
  font-size: 1.2em;
  text-align: left;
  position: relative;
  /* border-bottom: 1px solid #b6e3e3; */
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
    justify-content: left;
    align-items: center;
}
.home_list_ttl div{
  background: linear-gradient(transparent 50%, #ffff64 60%);
  padding: 0 10px 0 0;
  height: 1.5em;
  overflow: hidden;
  display: inline-block;
}
/* .home_list_ttl::before{
  content: "";
  position: absolute;
  width: 0.2em;
  background-color: #b6e3e3;
  height: 100%;
} */
.home_list_pay_wrap{
  height: 20%;
  display: flex;
  justify-content: end;
  gap: 5px;
  font-size: 0.7em;
}
.home_list_genre_wrap{
  height: 20%;
  display: flex;
  justify-content: end;
  gap: 5px;
  font-size: 0.7em;
}
/* --------------------------- */
/* --------------------------- */
</style>