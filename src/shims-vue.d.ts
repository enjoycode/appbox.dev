declare module '*.vue' {
  import Vue from 'vue';
  export default Vue;
}

//====以下扩展声明====
interface Window {
  $runtime: any;
}

declare const $runtime: any;
