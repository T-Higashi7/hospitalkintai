
<template>

<p>検索したい曲名を入力してください。</p>

<div class="text-gray-100">
 <div>
  <input type="text" v-model="term" class="bg-gray-900 text-gray-100">
  <button @click="search">検索</button>
 </div>
 <div class="mt-3" v-if="show">
   <button type="button" class="ms-1 btn btn-primary">トラック名</button>
   <button type="button" class="ms-1 btn btn-primary">アルバム名</button>
   <button type="button" class="ms-1 btn btn-primary">アーティスト名</button>

   <!-- ジャンルボタンをクリックすると、フィルター用のセレクトボックスを表示し、フィルタリング完了ボタンも表示する -->
   <button @click="genre_filter" type="button" class="ms-1 btn btn-primary">ジャンル</button>
   <!-- セレクトボックスの選択内容を動的に作成 -->
   <select v-model="selected_primarygenrename" multiple v-if="primaryGenreName_select_show">
     <option disabled value ="">選択してください</option>
     <option v-for="item in select_primarygenrename " v-bind:value="item">
       {{item}}
      </option>
   </select>
   <button @click="filter_finish" type="button" class="ms-1 btn btn-primary" v-if="filter_finish_show">フィルタリング完了</button>
  
   <p>選択した内容：{{selected_primarygenrename}} </p>

   </div>
   
   <div class="container mt-3">
    <table v-if="show">
     <tr><th @click="sortBy('trackId')" v-bind:class="addClass('trackId')">トラックID</th><th @click="sortBy('trackName')" v-bind:class="addClass('trackName')">トラック名</th>
     <th @click="sortBy('trackPrice')" v-bind:class="addClass('trackPrice')">トラックの料金</th><th @click="sortBy('collectionId')" v-bind:class="addClass('collectionId')" >アルバムID</th>
     <th @click="sortBy('collectionName')" v-bind:class="addClass('collectionName')">アルバム名</th><th @click="sortBy('collectionPrice')" v-bind:class="addClass('collectionPrice')">アルバムの料金</th>
     <th @click="sortBy('artistName')" v-bind:class="addClass('artistName')">アーティスト名</th><th @click="sortBy('primaryGenreName')" v-bind:class="addClass('primaryGenreName')">ジャンル</th>
     <th @click="sortBy('releaseDate')" v-bind:class="addClass('releaseDate')">リリース日</th></tr>
     <tr v-for = "item in search_primarygenrename" v-bind:key="item.trackId">
      <td>{{ item.trackId }}</td><td>{{ item.trackName }}</td><td>{{ "¥"+item.trackPrice }}</td><td>{{ item.collectionId }}</td><td>{{ item.collectionName }}</td>
      <td>{{ "¥"+item.collectionPrice }}</td><td>{{ item.artistName }}</td><td>{{ item.primaryGenreName }}</td><td>{{ item.releaseDate }}</td>
     </tr>
    </table>

   </div>
</div>

</template>

<script>
export default {

  data () {
    return {
      //検索ボックスの初期値を指定する。v-modelで検索ボックスのテキストと連動。
      term:"Thriller",
      //検索結果
      song: null,
      //tureの場合は、検索結果(テーブル)を表示し、falseの場合は検索結果(テーブル)を表示しない。
      show: false,
　　　//クリックしたカラム名がsort_keyに代入され昇順か降順かを判断します。
      sort_key: "",
      //trueの場合は昇順になり、falseの場合は降順になる。
      sort_asc: true,
      //セレクトボックス(ジャンル)の内容
      select_primarygenrename: null,
      //セレクトボックス(ジャンル)で選択した内容
      selected_primarygenrename: [],
      //trueの場合はジャンルのセレクトボックス(ジャンル)を表示し、falseの場合はジャンルのセレクトボックス(ジャンル)を表示しない。
      primaryGenreName_select_show: false,
      //trueの場合はフィルター完了ボタンを表示し、falseの場合はフィルター完了ボタンを表示しない。
      filter_finish_show: false
    }
  },

  methods:{
    
    //■ ■ ■ serchは検索ボタンをクリックした後に実行される関数になります。■ ■ ■
    search(){
      //検索ボックスの入力値をコンソールログに出力。
      console.log(this.term)
      //APIの接続先のエンドポイント(target: 'https://itunes.apple.com/serch)',の前半部分をurlに代入。
      const url = "/search";
      //エンドポイントの後半部分をqueryParameterに代入。
      const queryParameter = `?term=${this.term}&media=music&entity=musicTrack`;
      //エンドポイントにクエリパラメータでgetでリクエストを送信する。
      axios.get(url+queryParameter)
      //送信結果をレスポンスという引数で受け取る。
          .then((response) => {

            //-----showプロパティにtrueを代入し、フィルタリング用のボタンと検索結果を表示する。-----
            this.show = true;

            //-----ReleaseDateを加工(年月日の形式****-**-**)する。-----
            this.song =response.data.results.map(function(currentValue){
            　//現在処理している要素(response.data.resultsの要素)のreleaseDateを"T"の文字で区切り、aに配列として代入する。
            　let a =currentValue.releaseDate.split("T");
            　//現在処理している要素(response.data.resultsの要素)のreleaseDateにreleaseDateを"T"の文字で区切った前半部分(****-**-**)を代入する。
            　currentValue.releaseDate = a[0];
            //releaseDateの形式を(****-**-**）現在処理している要素をsongに返す。
            　return currentValue;
             })

            //------重複を削除したジャンルselect_primarygenrenameを作成する。(フィルタリングの選択肢に使用する為)-----
            const array_primaryGenreName = response.data.results.map(function(currentValue){
            　//array_primaryGenreNameに現在処理している要素(response.data.resultsの要素)のprimaryGenreNameを返し、primaryGenreNameのみの配列を作成する。
            　return currentValue.primaryGenreName;
            })
            //primaryGenreNameのみの配列(array_primaryGenreName)から重複を削除したものをselect_primarygenrenameに代入する。
            this.select_primarygenrename = array_primaryGenreName.filter( (ele,pos)=>array_primaryGenreName.indexOf(ele) == pos);
      

            //------検索ボタンを押した時のデフォルトのソートはreleaseDateの昇順とする-----
            this.song.sort((a,b) => {
            //「a」より「b」のほうが大きければ、-1を返し「a」は「b」の後ろに。bよりaのほうが大きい場合は1を返し、「a」は「b」の前に。
            // 大きさが同じ場合は0を返し、「a」は「b]の前になる。
            return (a.releaseDate < b.releaseDate) ? -1 : (a.releaseDate > b.releaseDate) ? 1 : 0;
      　})
      }) 
    },
　　 
    //■ ■ ■ ジャンルのセレクトボックスを表示し、フィルタリング完了ボタンも表示する。■ ■ ■
    genre_filter(){
      this.primaryGenreName_select_show = true,
      this.filter_finish_show = true
    },

    //■ ■ ■　セレクトボックスを非表示にし、フィルタリングを完了させる。■ ■ ■
    filter_finish(){
      this.primaryGenreName_select_show = false,
      this.filter_finish_show = false
    },

     //■ ■ ■ 検索結果をソートする機能の実装 ■ ■ ■
    //-----初めてカラムをクリックした時は、sort_keyにカラム名を代入しsort_ascにtrueを代入してクリックしたカラムを昇順に切り替える。-----
    //-----2回目に1回目と同じカラムをクリックした時は、sort_keyにカラム名を代入しsort_ascをfalseに切り替え、クリックしたカラムを降順に切り替える。-----
    sortBy(key) {
      //プロパティのソートキーと引数のソートキーが同じであれば、sort_ascに設定されている値の反転させる
      this.sort_key === key? (this.sort_asc = !this.sort_asc): (this.sort_asc = true);
      //sort_keyにクリックしたカラム名を代入する。
      this.sort_key = key;
    },
    //昇順、降順の矢印を切り替える。
    addClass(key) {
      return {
        //sort_keyがクリックしたカラム名と同じかつ、this.sort_ascがtrueの場合は、昇順
       asc: this.sort_key === key && this.sort_asc,
       //sort_keyがクリックしたカラム名と同じかつ、this.sort_ascがfalseの場合は、降順
       desc: this.sort_key === key && !this.sort_asc,
      }
    }
 },


  computed: {
　　//-----各列のソート切り替えを行う。クリックした列(カラム)を取得した結果を昇順にソートする。-----
    SortSong() {
      //もしsort_keyが空白ではなかった場合(列名をクリックして値が入っている場合)、
      if (this.sort_key != "") {
        //setに1を代入する。
        let set = 1;
        //sort_ascがtrue(昇順)の場合はsetに1を代入し、false(降順)の場合は、setに-1を代入する。
        this.sort_asc ? (set = 1) : (set = -1);
        //もし、aよりbのほうが大きい場合、setが1(sort_ascがtrueで昇順)だと返り値は「-1*1=-1」になるのでaはbの後ろにソートされる。
        //もし、bよりaのほうが大きい場合、setが1(sort_ascがtrueで昇順)だと返り値は「 1*1=-1」になるのでaはbの前にソートされる。
        this.song.sort((a, b) => {
          if (a[this.sort_key] < b[this.sort_key]) return -1 * set;
          if (a[this.sort_key] > b[this.sort_key]) return 1 * set;
          //同じ値だった場合は0を返す。
          return 0;
        });
        //ソートをした検索結果を返す。
        return this.song;
        //もしsort_keyが空白だった場合、
      } else {
        //ソートをしていない検索結果を返す。
        return this.song;
      }

    },
    
    //■ ■ ■ フィルタリング機能の実装 ■ ■ ■
    //セレクトボックスで選択した内容で絞り込みを行う。
    search_primarygenrename(){
      //もしジャンルのセレクトボックスの内容が未選択の場合、
      if(this.selected_primarygenrename==""){
      //全てのソートされたデータを返す。
       return this.SortSong
       //もしジャンルのセレクトボックスの内容が選択されていた場合で
      } else {
       //全てのソートされたデータを//セレクトボックスで選択した内容で絞り込みを行う。
      　return this.SortSong.filter(item=> {
        return this.selected_primarygenrename.includes(item.primaryGenreName)
    　})
     }
    }

  }
  

}

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

table, td, th{
    border: 1px solid black;
}

th{
  background-color: #EEFFFF;
}

.asc::after {
  content: "↓";
}
.desc::after {
  content: "↑";
}

</style>
